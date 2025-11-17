import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PaymentService } from 'src/payment/payment.service';
import { StudentsService } from 'src/students/students.service';
import { EmailService } from 'src/email/email.service';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly studentService: StudentsService,
    private readonly emailService: EmailService,
  ) {}

  // ======================================================
  // 🔥 PROCESA EL WEBHOOK YA VALIDADO POR EL CONTROLLER
  // ======================================================
  async processPaymentUpdate(mpPaymentId: string) {
    this.logger.log(`📩 Webhook recibido. MP Payment ID: ${mpPaymentId}`);

    // 1️⃣ Obtener información desde MercadoPago
    const mpData = await this.getMercadoPagoPayment(mpPaymentId);

    if (!mpData) {
      this.logger.error('❌ No se pudo obtener el pago desde MercadoPago.');
      return;
    }

    this.logger.log(`📌 Estado MP: ${mpData.status}`);

    // Solo procesar si está aprobado
    if (mpData.status !== 'approved') {
      this.logger.warn(`⚠️ Pago con estado ${mpData.status}, no se completa.`);
      return;
    }

    // 2️⃣ Obtener paymentId guardado en external_reference
    const paymentId = mpData.external_reference;

    if (!paymentId) {
      this.logger.error('❌ No se encontró external_reference en MP.');
      return;
    }

    this.logger.log(`📦 paymentId interno: ${paymentId}`);

    // 3️⃣ Marcar pago como completado en tu sistema
    let payment;
    try {
      payment = await this.paymentService.markPaymentAsCompleted(paymentId);
    } catch (err) {
      this.logger.error('❌ Error marcando pago como completado.', err);
      return;
    }

    this.logger.log(`💰 Pago interno completado: ${payment._id}`);

    // 4️⃣ Buscar estudiante
    const student = await this.studentService.findOne(payment.student.toString());

    if (!student) {
      this.logger.error('❌ Estudiante no encontrado en DB.');
      return;
    }

    this.logger.log(`👤 Estudiante: ${student.name} ${student.lastname}`);

    // 5️⃣ Generar ticket PDF
    let ticketPath: string | null = null;

    try {
      ticketPath = await this.generateTicket(mpData, student);
      this.logger.log(`📄 Ticket generado: ${ticketPath}`);
    } catch (err) {
      this.logger.error('❌ Error generando ticket.', err);
    }

    // 6️⃣ Enviar email
    try {
      await this.emailService.sendPaymentReceivedEmail(student.email, ticketPath);
      this.logger.log(`📨 Email enviado a ${student.email}`);
    } catch (err) {
      this.logger.error('❌ Error enviando email.', err);
    }

    this.logger.log(`🎉 Webhook procesado correctamente para MP Payment ${mpPaymentId}`);
  }

  // ======================================================
  // 🔍 CONSULTAR PAGO EN MERCADOPAGO
  // ======================================================
  private async getMercadoPagoPayment(id: string) {
    try {
      const response = await axios.get(
        `https://api.mercadopago.com/v1/payments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        },
      );

      return response.data;

    } catch (err) {
      this.logger.error(
        '❌ Error consultando pago en MercadoPago',
        err.response?.data || err.message,
      );
      return null;
    }
  }

  // ======================================================
  // 🧾 GENERAR PDF (TICKET)
  // ======================================================
  private async generateTicket(mpData: any, student: any) {
    const dir = 'tickets';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const file = `${dir}/ticket-${mpData.id}.pdf`;
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(file));

    doc.fontSize(20).text('COMPROBANTE DE PAGO', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Nombre: ${student.name} ${student.lastname}`);
    doc.text(`ID Estudiante: ${student._id}`);
    doc.moveDown();
    doc.text(`Pago MercadoPago ID: ${mpData.id}`);
    doc.text(`Monto: $${mpData.transaction_amount}`);
    doc.text(`Estado: ${mpData.status}`);
    doc.text(`Método: ${mpData.payment_method_id}`);
    doc.text(`Fecha: ${mpData.date_approved}`);

    doc.end();

    return file;
  }
}
