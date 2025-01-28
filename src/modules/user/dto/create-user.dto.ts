import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Nama harus memiliki setidaknya 2 huruf!' })
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail(undefined, { message: 'Format email tidak sesuai, harap isi dengan format yang sesuai!' })
  email: string;

  @IsNotEmpty()
  @Matches(REGEX_PASSWORD, {
    message: `Kata sandi harus mengandung minimal 8 dan maksimal 20 karakter, minimal satu huruf kapital, satu huruf kecil, satu angka dan satu karakter khusus.`,
  })
  password: string;
}
