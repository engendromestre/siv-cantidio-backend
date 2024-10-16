import {
  InvalidMediaFileMimeTypeError,
  InvalidMediaFileSizeError,
} from '../../../shared/domain/validators/media-file.validator';
import { Photo } from '../photo.vo';
import { PatientId } from '../patient.aggregate';

describe('Photo Unit Tests', () => {
  it('should create a Banner object from a valid file', () => {
    const data = Buffer.alloc(1024);
    const patientId = new PatientId();
    const [photo, error] = Photo.createFromFile({
      raw_name: 'test.png',
      mime_type: 'image/png',
      size: data.length,
      patient_id: patientId,
    }).asArray();

    expect(error).toBeNull();
    expect(photo).toBeInstanceOf(Photo);
    expect(photo.name).toMatch(/\.png$/);
    expect(photo.location).toBe(`patients/${patientId.id}/images`);
  });

  it('should throw an error if the file size is too large', () => {
    const data = Buffer.alloc(Photo.max_size + 1);
    const patientId = new PatientId();
    const [banner, error] = Photo.createFromFile({
      raw_name: 'test.png',
      mime_type: 'photo/png',
      size: data.length,
      patient_id: patientId,
    });

    expect(banner).toBeNull();
    expect(error).toBeInstanceOf(InvalidMediaFileSizeError);
  });

  it('should throw an error if the file mime type is not valid', () => {
    const data = Buffer.alloc(1024);
    const patientId = new PatientId();
    const [banner, error] = Photo.createFromFile({
      raw_name: 'test.txt',
      mime_type: 'text/plain',
      size: data.length,
      patient_id: patientId,
    });

    expect(banner).toBeNull();
    expect(error).toBeInstanceOf(InvalidMediaFileMimeTypeError);
  });
});
