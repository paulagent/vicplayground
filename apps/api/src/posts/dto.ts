import { IsArray, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsInt()
  categoryId!: number;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  authorName?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(4000)
  body!: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  authorName?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(4000)
  body?: string;
}
