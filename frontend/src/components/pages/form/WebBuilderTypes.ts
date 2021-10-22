
export class PresentationDataType {

  name: string;
  description: string;
  address: string;
  cityAndCode: string;
  phoneNumber: string;
  emailAddress: string;

  constructor(input: any) {
    this.name = input.name;
    this.description = input.description;
    this.address = input.address;
    this.cityAndCode = input.cityAndCode;
    this.phoneNumber = input.phoneNumber;
    this.emailAddress = input.emailAddress;
  }
}

export interface ImgData {
  source: 'file' | 'unsplash' | 'hosted' | 'url';
  path: string;
};
