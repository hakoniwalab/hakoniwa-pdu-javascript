import { ProtocolClient } from './ProtocolClient.js';
import { ProtocolServer } from './ProtocolServer.js';

/**
 * Dynamically load packet classes and converters for a service.
 * @param {string} srv - Service name such as "AddTwoInts".
 * @param {string} pkg - Base package where PDU modules reside (e.g., "hako_srv_msgs").
 * @returns {Promise<{
 *   ReqPacket: any,
 *   ResPacket: any,
 *   reqEncoder: Function,
 *   reqDecoder: Function,
 *   resEncoder: Function,
 *   resDecoder: Function
 * }>} 
 */
async function loadProtocolComponents(srv, pkg) {
    const basePath = `../pdu_msgs/${pkg}`;

    const reqPacketPath = `${basePath}/pdu_jstype_${srv}RequestPacket.js`;
    const resPacketPath = `${basePath}/pdu_jstype_${srv}ResponsePacket.js`;
    const reqConvPath = `${basePath}/pdu_conv_${srv}RequestPacket.js`;
    const resConvPath = `${basePath}/pdu_conv_${srv}ResponsePacket.js`;

    try {
        const reqPacketModule = await import(reqPacketPath);
        const resPacketModule = await import(resPacketPath);
        const reqConvModule = await import(reqConvPath);
        const resConvModule = await import(resConvPath);

        const ReqPacket = reqPacketModule[`${srv}RequestPacket`];
        const ResPacket = resPacketModule[`${srv}ResponsePacket`];
        
        const reqEncoder = reqConvModule[`jsToPdu_${srv}RequestPacket`];
        const reqDecoder = reqConvModule[`pduToJs_${srv}RequestPacket`];
        const resEncoder = resConvModule[`jsToPdu_${srv}ResponsePacket`];
        const resDecoder = resConvModule[`pduToJs_${srv}ResponsePacket`];

        if (!ReqPacket || !ResPacket || !reqEncoder || !reqDecoder || !resEncoder || !resDecoder) {
            throw new Error(`One or more components are missing in the loaded modules for service '${srv}'`);
        }

        return {
            ReqPacket,
            ResPacket,
            reqEncoder,
            reqDecoder,
            resEncoder,
            resDecoder
        };
    } catch (e) {
        console.error(`Failed to load protocol components for service '${srv}' in package '${pkg}':`, e);
        throw new Error(`Failed to load protocol components for service '${srv}'`);
    }
}

/**
 * Creates a ProtocolClient instance from a service name.
 * @param {{
 *   pduManager: any,
 *   serviceName: string,
 *   clientName: string,
 *   srv: string,
 *   pkg?: string
 * }} options
 * @returns {Promise<ProtocolClient>}
 */
async function makeProtocolClient({
    pduManager,
    serviceName,
    clientName,
    srv,
    pkg = 'hako_srv_msgs'
}) {
    const {
        ReqPacket, ResPacket, reqEncoder, reqDecoder, resEncoder, resDecoder
    } = await loadProtocolComponents(srv, pkg);

    return new ProtocolClient(
        pduManager,
        serviceName,
        clientName,
        ReqPacket,
        reqEncoder,
        reqDecoder,
        ResPacket,
        resEncoder,
        resDecoder
    );
}

/**
 * Creates multiple ProtocolClient instances from a list of service specs.
 * Python make_protocol_clients 相当。
 * 
 * @param {{
 *   pduManager: any,
 *   services: Array<{
 *     service_name?: string,  // snake
 *     serviceName?: string,   // camel
 *     client_name?: string,
 *     clientName?: string,
 *     srv: string,
 *     pkg?: string,
 *     pdu_manager?: any,
 *     pduManager?: any
 *   }>,
 *   pkg?: string,
 *   ProtocolClientClass?: any
 * }} options
 * @returns {Promise<Record<string, any>>} // { [serviceName]: ProtocolClient }
 */
async function makeProtocolClients({
  pduManager,
  services,
  pkg = 'hako_srv_msgs',
  ProtocolClientClass = null
}) {
  if (!Array.isArray(services)) {
    throw new Error('makeProtocolClients: "services" must be an array');
  }

  // 1サービスずつクライアントを作る（並列）
  const pairs = await Promise.all(services.map(async (spec) => {
    const serviceName = spec.serviceName ?? spec.service_name;
    const clientName  = spec.clientName  ?? spec.client_name;
    const srv         = spec.srv;
    const servicePkg  = spec.pkg ?? pkg;
    const manager     = spec.pduManager ?? spec.pdu_manager ?? pduManager;

    if (!serviceName || !clientName || !srv) {
      throw new Error(`makeProtocolClients: invalid spec: ${JSON.stringify(spec)}`);
    }

    let client;
    if (ProtocolClientClass) {
      // 明示クラスが指定された場合：コンポーネントをロードして手動 new
      const {
        ReqPacket, ResPacket, reqEncoder, reqDecoder, resEncoder, resDecoder
      } = await loadProtocolComponents(srv, servicePkg);

      client = new ProtocolClientClass(
        manager,
        serviceName,
        clientName,
        ReqPacket,
        reqEncoder,
        reqDecoder,
        ResPacket,
        resEncoder,
        resDecoder
      );
    } else {
      // 既存ヘルパーに委譲
      client = await makeProtocolClient({
        pduManager: manager,
        serviceName,
        clientName,
        srv,
        pkg: servicePkg
      });
    }

    return [serviceName, client];
  }));

  return Object.fromEntries(pairs);
}

/**
 * Creates a ProtocolServer instance from a service name.
 * @param {{
 *   pduManager: any,
 *   serviceName: string,
 *   srv: string,
 *   maxClients: number,
 *   pkg?: string
 * }} options
 * @returns {Promise<ProtocolServer>}
 */
async function makeProtocolServer({
    pduManager,
    serviceName,
    srv,
    maxClients,
    pkg = 'hako_srv_msgs'
}) {
    const {
        ReqPacket, ResPacket, reqEncoder, reqDecoder, resEncoder, resDecoder
    } = await loadProtocolComponents(srv, pkg);

    return new ProtocolServer(
        pduManager,
        serviceName,
        maxClients,
        ReqPacket,
        reqEncoder,
        reqDecoder,
        ResPacket,
        resEncoder,
        resDecoder
    );
}

export {
    loadProtocolComponents,
    makeProtocolClient,
    makeProtocolClients,
    makeProtocolServer
};