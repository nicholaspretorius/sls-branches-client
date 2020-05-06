export interface IContact {
  contactType: string;
  contactHandle: string;
}

export interface ICountry {
  countryCode: string;
  countryName: string;
  countryId?: string;
}

export interface IChannel {
  channelType: string;
  channelHandle: string;
}

export interface IEntity {
  entityId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  country: ICountry;
  contacts: IContact[];
  website: string;
  attachment?: any,
  attachmentURL?: string,
}