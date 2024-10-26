import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Login } from './schema/login.schema';
import { CreateLogin } from './dto/createlogin.dto';
import { UpdateLogin } from './dto/updatelogin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService {

    constructor(
        @InjectModel(Login.name) // Cambiado para MongoDB con Mongoose
        private loginModel: Model<Login>
    ){}

    async login(updateLogin: UpdateLogin) {
        try {
            const user = await this.loginModel.findOne({ email: updateLogin.email });
            if (!user) return false;

            const isPasswordMatch = await bcrypt.compare(updateLogin.password, user.password);
            return isPasswordMatch ? user : false;
        } catch (error) {
            return false;
        }
    }

    async create(createLogin: CreateLogin) {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(createLogin.password, saltOrRounds);
        const newUser = new this.loginModel({ ...createLogin, password: hash });

        return await newUser.save();
    }

    async update(id_user: string, updateLogin: UpdateLogin) {
        try {
            if (updateLogin.password) {
                const saltOrRounds = 10;
                updateLogin.password = await bcrypt.hash(updateLogin.password, saltOrRounds);
            }
            return await this.loginModel.findByIdAndUpdate(id_user, updateLogin, { new: true });
        } catch (error) {
            return null;
        }
    }
    
    async findAll() {
        return await this.loginModel.find();
    }

    async findOne(id_user: string) {
        return await this.loginModel.findById(id_user);
    }

    async delete(id_user: string) {
        return await this.loginModel.findByIdAndDelete(id_user);
    }
}
