import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SetlistItemDto {
  @IsString()
  title: string;

  order: number;

  @IsString()
  type: 'song' | 'mc' | 'encore';
}

class NearbyFacilityDto {
  @IsString()
  name: string;

  @IsString()
  category: 'izakaya' | 'cafe' | 'other';

  @IsOptional()
  @IsString()
  memo?: string;
}

export class CreateLiveDto {
  @IsString()
  artistName: string;

  @IsString()
  performanceDate: string;

  @IsString()
  venueName: string;

  @IsOptional()
  @IsString()
  tourName?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  googleMapUrl?: string;

  @IsOptional()
  @IsString()
  impression?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetlistItemDto)
  setlist?: SetlistItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NearbyFacilityDto)
  nearbyFacilities?: NearbyFacilityDto[];
}
