import { 
    Controller,
    Post,
    Get,
    Delete,
    Put,
    Body,
    ValidationPipe,
    Param
} from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLogin } from './dto/createlogin.dto';
import { UpdateLogin } from './dto/updatelogin.dto';


    @Controller('login')
    export class LoginController {
        
        constructor(
           private loginService: LoginService
        ) {}
    
        @Post()
        async login(@Body(new ValidationPipe()) updateLogin: UpdateLogin) {
            return await this.loginService.login(updateLogin);
        }
    
        @Post('register')
        async create(@Body(new ValidationPipe()) createLogin: CreateLogin) {
            return await this.loginService.create(createLogin);
        }
    
        // Actualización con PUT, ya que es una operación de modificación
        @Put('update/:id_user')  // Cambié de POST a PUT
        async update(
            @Param('id_user') id_user: string,  // Asegurando que el id es un string
            @Body(new ValidationPipe()) updateLogin: UpdateLogin
        ) {
            return await this.loginService.update(id_user, updateLogin);
        }
    
      
    
        @Get('')
        async findAll() {
            return await this.loginService.findAll();
        }
    
        @Get('find/:id_user')
        async findOne(@Param('id_user') id_user: string) {
            return await this.loginService.findOne(id_user);
        }


    
        // Perfil actualizado también con PUT
        @Put('update/:id')  // Cambié de POST a PUT
        async updateProfile(
            @Param('id') id: string,
            @Body() updateLogin: UpdateLogin
        ) {
            return await this.loginService.update(id, updateLogin);
        }
    
        @Delete('delete/:id_user')
        async delete(@Param('id_user') id_user: string) {
            return await this.loginService.delete(id_user);
        }
    }
    

