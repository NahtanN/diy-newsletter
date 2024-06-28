import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, IsUrl, ValidateNested } from 'class-validator';

export class NewsletterSourcePreferencesDto {
 @ApiProperty({
  default: 'Título da fonte',
 })
 @IsString()
 @IsNotEmpty()
 title: string;

 @ApiProperty({
  default: 'https://...',
 })
 @IsUrl()
 @IsNotEmpty()
 url: string;
}

export class SavePreferencesDto {
 @ApiProperty({
  default: 'Título da Newsletter',
 })
 @IsString()
 @IsNotEmpty()
 title: string;

 @ApiProperty({
  type: [NewsletterSourcePreferencesDto],
 })
 @IsArray()
 @ArrayMinSize(1)
 @ValidateNested()
 @Type(() => NewsletterSourcePreferencesDto)
 sources: NewsletterSourcePreferencesDto[];
}
