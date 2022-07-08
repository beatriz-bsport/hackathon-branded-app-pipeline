import React from 'react';
import {
  CommunicationFeedMessageBubble,
  Props,
} from './CommunicationFeedMessageBubble.component';
import MembersFactory from '../../member/factories/Member';
import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
} from '@bsport/common/lib/master-data/communication-kind';
import { Communication } from '../types';

const CustomTemplate = (args: Props) => (
  <CommunicationFeedMessageBubble {...args} />
);

const communicationEmail: Communication = {
  uuid: 'foo',
  campaign_id: 'foo',
  data: {
    subject: 'Avez-vous reçu mon mail ?',
    body: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings></xml><![endif]--> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta name="x-apple-disable-message-reformatting"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title></title> <style type="text/css"> @media only screen and (min-width: 520px){.u-row{width: 500px !important;}.u-row .u-col{vertical-align: top;}.u-row .u-col-33p33{width: 166.65px !important;}.u-row .u-col-66p67{width: 333.35px !important;}}@media (max-width: 520px){.u-row-container{max-width: 100% !important; padding-left: 0px !important; padding-right: 0px !important;}.u-row .u-col{min-width: 320px !important; max-width: 100% !important; display: block !important;}.u-row{width: calc(100% - 40px) !important;}.u-col{width: 100% !important;}.u-col > div{margin: 0 auto;}}body{margin: 0; padding: 0;}table,tr,td{vertical-align: top; border-collapse: collapse;}p{margin: 0;}.ie-container table,.mso-container table{table-layout: fixed;}*{line-height: inherit;}a[x-apple-data-detectors='true']{color: inherit !important; text-decoration: none !important;}table, td{color: #000000;}a{color: #0000ee; text-decoration: underline;}</style> </head><body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e7e7e7;color: #000000"> <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e7e7e7;width:100%" cellpadding="0" cellspacing="0"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 167px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <div class="menu" style="text-align:center"> <a href="https://www.youtube.com" target="_blank" style="padding:5px 15px;display:inline-block;color:#0068A5;font-family:arial,helvetica,sans-serif;font-size:14px;text-decoration:none" > Youtube </a> <a href="https://www.google.com" target="_self" style="padding:5px 15px;display:inline-block;color:#0068A5;font-family:arial,helvetica,sans-serif;font-size:14px;text-decoration:none" > Google </a> </div></td></tr></tbody></table> </div></div></div><div class="u-col u-col-66p67" style="max-width: 320px;min-width: 333px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <h1 style="margin: 0px; color: #a33e7d; line-height: 140%; text-align: center; word-wrap: break-word; font-weight: normal; font-family: comic sans ms,sans-serif; font-size: 30px;"> Some big title </h1> </td></tr></tbody></table><table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding-right: 0px;padding-left: 0px;" align="center"> <img align="center" border="0" src="https://images.unlayer.com/projects/0/1655999035194-logo_berrichonne.png" alt="yo" title="yo" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 241px;" width="241"/> </td></tr></table> </td></tr></tbody></table><table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <div align="center"> <a href="" target="_blank" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #3AAEE0; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;"> <span style="display:block;padding:10px 20px;line-height:120%;"><span style="font-size: 14px; line-height: 16.8px;">La fin du mail</span></span> </a> </div></td></tr></tbody></table><table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <div style="line-height: 140%; text-align: left; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 140%;">&nbsp;</p><p style="font-size: 14px; line-height: 140%;"><br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce mi justo, viverra nec justo nec, ornare facilisis ex. Phasellus risus ipsum, pellentesque elementum lectus id, scelerisque semper diam. Phasellus eget egestas diam. Nulla orci est, tincidunt eget consectetur ac, commodo vitae turpis. Etiam rhoncus tristique tellus. Maecenas maximus lorem sit amet finibus lacinia. Donec quis pharetra lacus.</p><p style="font-size: 14px; line-height: 140%;">Pellentesque faucibus ipsum eu aliquam dictum. Mauris laoreet, quam vitae vulputate consectetur, nisi justo sagittis purus, id tincidunt massa massa et nisl. Sed congue metus nec lacus interdum rhoncus sit amet quis tortor. Maecenas pellentesque augue id libero feugiat, eu pretium turpis pellentesque. Donec ac velit leo. Quisque felis ligula, fringilla at orci sed, rhoncus pharetra turpis. Nunc rhoncus congue pharetra. Praesent et pharetra risus.</p><p style="font-size: 14px; line-height: 140%;">Maecenas molestie sapien eu tristique tempus. Cras odio sem, finibus sit amet condimentum molestie, cursus in elit. Sed mauris risus, efficitur sed odio dapibus, auctor imperdiet nulla. Fusce dignissim lectus non iaculis rhoncus. Nunc convallis risus nec sollicitudin congue. Duis pellentesque, leo facilisis auctor scelerisque, felis lectus facilisis libero, nec ultricies nisl justo sed dolor. Donec malesuada dignissim leo, sed auctor ipsum tempus a. Vestibulum consequat arcu vulputate pulvinar commodo. Phasellus eleifend eu urna a iaculis. Cras rutrum pretium orci sed euismod. Nunc in maximus ligula. Mauris sed ex nec erat sodales feugiat quis eget dolor. Cras sit amet diam est.</p><p style="font-size: 14px; line-height: 140%;">Phasellus et erat viverra lacus lobortis vulputate. Proin elit arcu, mollis sit amet faucibus quis, tempor vel lacus. Fusce convallis accumsan accumsan. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque finibus purus at elit egestas, sit amet sollicitudin mi maximus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed non blandit leo. Nunc aliquam malesuada feugiat. Nulla pharetra ligula eget porttitor suscipit. Aenean varius elit at pellentesque volutpat. Phasellus et augue dapibus, blandit risus aliquet, auctor neque. Fusce magna urna, accumsan eu augue et, venenatis interdum tortor. Sed sed leo vitae sapien pretium consequat eget at est. Pellentesque maximus placerat sodales.</p><p style="font-size: 14px; line-height: 140%;">Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque venenatis risus vel lobortis venenatis. Ut ultrices eros ut nisi faucibus rhoncus. Aliquam sit amet mauris malesuada, convallis magna non, ultrices ex. Fusce id libero lorem. Quisque euismod cursus lectus, non feugiat dolor. Fusce dignissim sagittis ante, eget condimentum dui imperdiet et. Ut sit amet dictum ex. Proin euismod mollis leo et convallis. Etiam vehicula consectetur convallis. Aliquam lorem lacus, porttitor a malesuada nec, commodo a ex. Curabitur ut urna vitae erat consectetur vestibulum. Praesent suscipit, nisl a egestas sagittis, mi sapien sollicitudin tellus, a feugiat massa augue sit amet est.</p></div></td></tr></tbody></table> </div></div></div></div></div></div></td></tr></tbody> </table> </body></html>`,
    uuid: 'aaabbb',
    recipient_list: [],
    tags_group: [],
  },
  total_recipients: 3,
  date_created: '2021-01-25T12:22:44.171312+01:00',
  total_read: 10,
  total_click: 15,
  text: 'text',
  sms_text: 'foo',
  title: 'foo',
  kind: COMMUNICATION_KIND_EMAIL,
};

const communicationSMS: Communication = {
  uuid: 'foo',
  campaign_id: 'foo',
  data: {
    subject: 'foo',
    body: `Cras nec leo sagittis, tincidunt risus et, pharetra tortor.  Duis eget bibendum orci. Sed id purus vitae ex faucibus dictum non et quam. Etiam efficitur nec erat in volutpat. Nunc mattis erat fringilla tellus suscipit varius. Proin sit amet risus feugiat sem pharetra congue a eu elit. Donec volutpat lobortis nulla, a interdum dui auctor ut. Nunc tempor velit eget lectus molestie, ac mattis elit varius.  Suspendisse aliquet venenatis justo, id scelerisque lacus sollicitudin eget. Integer augue augue, pellentesque at tempor ac, aliquet nec ante. Fusce dapibus tortor eget massa ornare fringilla. Ut faucibus, sapien at congue venenatis, nibh sem lacinia enim, sit amet ultricies lacus tellus ut sapien. ${
      1 === 1
    }`,
    uuid: 'aaabbb',
    recipient_list: [],
    tags_group: [],
  },
  total_recipients: 18,
  date_created: '2021-01-25T12:22:44.171312+01:00',
  total_read: 10,
  total_click: 15,
  text: 'text',
  sms_text: 'foo',
  title: 'foo',
  kind: COMMUNICATION_KIND_SMS,
};

const communicationPush: Communication = {
  uuid: 'foo',
  campaign_id: 'foo',
  data: {
    subject: 'Tema la notification',
    body: `Proin sit amet risus feugiat sem pharetra congue a eu elit. Donec volutpat lobortis nulla, a interdum dui auctor ut. Nunc tempor velit eget lectus molestie, ac mattis elit varius.  Suspendisse aliquet venenatis justo, id scelerisque lacus sollicitudin eget. Integer augue augue, pellentesque at tempor ac, aliquet nec ante. Fusce dapibus tortor eget massa ornare fringilla. Ut faucibus, sapien at congue venenatis, nibh sem lacinia enim, sit amet ultricies lacus tellus ut sapien. ${
      1 === 1
    }`,
    uuid: 'aaabbb',
    recipient_list: [],
    tags_group: [],
  },
  total_recipients: 2,
  date_created: '2021-01-25T12:22:44.171312+01:00',
  total_read: 10,
  total_click: 15,
  text: 'text',
  sms_text: 'foo',
  title: 'foo',
  kind: COMMUNICATION_KIND_PUSH_NOTIFICATION,
};

export const Email = CustomTemplate.bind({});

Email.args = {
  channel: 'Automatique',
  members: MembersFactory(3),
  communication: communicationEmail,
};

export const Sms = CustomTemplate.bind({});

Sms.args = {
  channel: 'Manuel',
  members: MembersFactory(5),
  communication: communicationSMS,
};

export const PushNotif = CustomTemplate.bind({});

PushNotif.args = {
  channel: 'Manuel',
  members: MembersFactory(2),
  communication: communicationPush,
};

export default {
  title: 'Library/Communication-V2/MessageBubble',
  component: CommunicationFeedMessageBubble,
  parameters: {
    docs: {
      page: null,
    },
  },
};
