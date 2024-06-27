import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, IsUrl, ValidateNested } from 'class-validator';

export class SavePreferencesDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => NewsletterSourcePreferencesDto)
  sources: NewsletterSourcePreferencesDto[];
}

export class NewsletterSourcePreferencesDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;
}
