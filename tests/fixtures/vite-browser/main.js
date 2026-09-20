import { PduConvertor, PduEncoding } from 'hakoniwa-pdu-javascript/browser';

const config = {
  getChannelInfo: () => ({ type: 'std_msgs/String' }),
};

const convertor = new PduConvertor('', config, { pdu_encoding: PduEncoding.CDR });
window.browserConverterContract = async () => {
  const raw = await convertor.convert_json_to_binary('Robot', 'message', { data: 'bundle contract' });
  return await convertor.convert_binary_to_json('Robot', 'message', raw);
};
