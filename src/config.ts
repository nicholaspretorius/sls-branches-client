export default {
  s3: {
    REGION: "eu-west-1",
    BUCKET: "ncp-branches-entities-uploads-bucket-dev",
  },
  apiGateway: {
    REGION: "eu-west-1",
    URL: "https://eolgsqft2g.execute-api.eu-west-1.amazonaws.com/dev/",
  },
  cognito: {
    REGION: "eu-west-1",
    USER_POOL_ID: "eu-west-1_VR5HeZzqs",
    APP_CLIENT_ID: "aobvt06f3sve6l6lljl1q5o88",
    IDENTITY_POOL_ID: "eu-west-1:21c78078-b026-4844-ab66-a76f9679289d",
  },
  MAX_ATTACHMENT_SIZE: 5000000,
};