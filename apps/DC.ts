import {App} from "../src/Decorator/App";
import {Websocket} from "../src/Decorator/Websocket";
import {JsonResponse} from "../src/Response/JsonResponse";

@App({
    name: 'DC',
    port: 65000
})
export class DC {
    /**
     * On connection to the global room.
     */
    @Websocket('connection')
    onGlobalTopicConnection() {
        console.log(`Someone connected to /. Nothing to see here...`);
    }

    /**
     * Request of transaction data
     */
    @Websocket('connection', '/efkon/no/dc/ctrl/cmd/transactions/get')
    onTransactionDataRequest(ws) {
        ws.on('message', function (message) {
            console.log(`Incoming message: ${message}`);
        });
    }

    /**
     * Response of transaction data
     */
    @Websocket('connection', '/efkon/no/dc/ctrl/cmd/response/transactions-uuid')
    async onTransactionDataResponse(ws) {
        const transaction = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<cp:trafficepoch xmlns:cp="http://www.efkon.com/xml/norcp/v01" xmlns:ec="http://www.efkon.com/xml/common/v01" xmlns:el="http://www.efkon.com/xml/elite/v08"\n' +
            '                 xmlns:tr="http://www.efkon.com/xml/transit_event/v01" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" begin="2001-12-17T09:30:47Z" end="2001-12-17T09:30:47Z"\n' +
            '                 xsi:schemaLocation="http://www.efkon.com/xml/norcp/v01 norcp.xsd">\n' +
            '    <cp:trafficevent uuid="00000000-0000-0000-0000-000000000000" time="2001-12-17T09:30:47Z">\n' +
            '        <System chargingpoint="0" direction="0" lane="0" spottest="true">\n' +
            '            <position lat="3.14159265358979" lon="3.14159265358979" direction="3.14159265358979" speed="3.14159265358979"/>\n' +
            '        </System>\n' +
            '        <ComplianceChecks signalcode="0" vehicleclass="0" tagstatusflag="0" signalcodebitmap="0" lightsignalcode="0" lanemode="0" validationfile="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"/>\n' +
            '        <autopass countrycode="0" issueridentifier="0" servicenumber="aaaaa" keygeneration="0" obustatus="0" transactioncounter="0" mac1status="0" mac2status="0" signallevel="0" rnd1="aaaaaaaaaa"\n' +
            '                  mactime="2001-12-17T09:30:47Z" obuid="aaaaaaaaaaaaaaaaa" rnd2="aaaaaaaaaa" mac1="aaaaaaaaa" mac2="aaaaaaaaa"/>\n' +
            '        <DeterminedLPN confidence="0">0</DeterminedLPN>\n' +
            '\n' +
            '        <LPN confidence="0" imageref="image1" id="0">\n' +
            '            <ec:Plate confidence="0">normalizedString</ec:Plate>\n' +
            '            <ec:Country confidence="0">normalizedString</ec:Country>\n' +
            '            <ec:LetterHeight>0</ec:LetterHeight>\n' +
            '\n' +
            '            <ec:Frame>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '            </ec:Frame>\n' +
            '            <ec:Exposure>normalizedString</ec:Exposure>\n' +
            '            <ec:TimeDuration unit="ms">3.14159265358979</ec:TimeDuration>\n' +
            '            <ec:EngineIdentifier>normalizedString</ec:EngineIdentifier>\n' +
            '            <ec:Comment>normalizedString</ec:Comment>\n' +
            '        </LPN>\n' +
            '\n' +
            '        <LPN confidence="0" imageref="image2" id="1">\n' +
            '            <ec:Plate confidence="0">normalizedString</ec:Plate>\n' +
            '            <ec:Country confidence="0">normalizedString</ec:Country>\n' +
            '            <ec:LetterHeight>0</ec:LetterHeight>\n' +
            '            <ec:Frame>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '            </ec:Frame>\n' +
            '            <ec:Exposure>normalizedString</ec:Exposure>\n' +
            '            <ec:TimeDuration unit="s">3.14159265358979</ec:TimeDuration>\n' +
            '            <ec:EngineIdentifier>normalizedString</ec:EngineIdentifier>\n' +
            '            <ec:Comment>normalizedString</ec:Comment>\n' +
            '        </LPN>\n' +
            '        <DeterminedClassification confidence="0">0</DeterminedClassification>\n' +
            '        <Classification label="motorbike" confidence="0" id="0"/>\n' +
            '        <Classification label="van" confidence="0" id="1"/>\n' +
            '        <Image cameraid="a" time="2001-12-17T09:30:47Z" type="frontshot" format="thumbnail" mimetype="a" href="image1" sha256="41394644363445313243" comment="a">\n' +
            '            <ec:CameraParameter name="a">String</ec:CameraParameter>\n' +
            '            <ec:CameraParameter name="a">String</ec:CameraParameter>\n' +
            '\n' +
            '        </Image>\n' +
            '        <Image cameraid="a" time="2001-12-17T09:30:47Z" type="backshot" format="thumbnail" mimetype="a" href="image2" sha256="41394644363445313243" comment="a">\n' +
            '            <ec:CameraParameter name="a">String</ec:CameraParameter>\n' +
            '            <ec:CameraParameter name="a">String</ec:CameraParameter>\n' +
            '        </Image>\n' +
            '    </cp:trafficevent>\n' +
            '    <cp:trafficevent uuid="00000000-12345-0000-0000-000000000000" time="2001-12-17T09:30:47Z">\n' +
            '        <System chargingpoint="0" direction="0" lane="0" spottest="true">\n' +
            '            <position lat="3.14159265358979" lon="3.14159265358979" direction="3.14159265358979" speed="3.14159265358979"/>\n' +
            '        </System>\n' +
            '        <ComplianceChecks signalcode="0" vehicleclass="0" tagstatusflag="0" signalcodebitmap="0" lightsignalcode="0" lanemode="0" validationfile="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"/>\n' +
            '        <autopass countrycode="0" issueridentifier="0" servicenumber="aaaaa" keygeneration="0" obustatus="0" transactioncounter="0" mac1status="0" mac2status="0" signallevel="0" rnd1="aaaaaaaaaa"\n' +
            '                  mactime="2001-12-17T09:30:47Z" obuid="aaaaaaaaaaaaaaaaa" rnd2="aaaaaaaaaa" mac1="aaaaaaaaa" mac2="aaaaaaaaa"/>\n' +
            '        <DeterminedLPN confidence="0">0</DeterminedLPN>\n' +
            '\n' +
            '        <LPN confidence="0" imageref="image1" id="0">\n' +
            '            <ec:Plate confidence="0">normalizedString</ec:Plate>\n' +
            '            <ec:Country confidence="0">normalizedString</ec:Country>\n' +
            '            <ec:LetterHeight>0</ec:LetterHeight>\n' +
            '\n' +
            '            <ec:Frame>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '            </ec:Frame>\n' +
            '            <ec:Exposure>normalizedString</ec:Exposure>\n' +
            '            <ec:TimeDuration unit="ms">3.14159265358979</ec:TimeDuration>\n' +
            '            <ec:EngineIdentifier>normalizedString</ec:EngineIdentifier>\n' +
            '            <ec:Comment>normalizedString</ec:Comment>\n' +
            '        </LPN>\n' +
            '\n' +
            '        <LPN confidence="0" imageref="image2" id="1">\n' +
            '            <ec:Plate confidence="0">normalizedString</ec:Plate>\n' +
            '            <ec:Country confidence="0">normalizedString</ec:Country>\n' +
            '            <ec:LetterHeight>0</ec:LetterHeight>\n' +
            '            <ec:Frame>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '                <ec:Point x="0" y="0"/>\n' +
            '            </ec:Frame>\n' +
            '            <ec:Exposure>normalizedString</ec:Exposure>\n' +
            '            <ec:TimeDuration unit="s">3.14159265358979</ec:TimeDuration>\n' +
            '            <ec:EngineIdentifier>normalizedString</ec:EngineIdentifier>\n' +
            '            <ec:Comment>normalizedString</ec:Comment>\n' +
            '        </LPN>\n' +
            '        <DeterminedClassification confidence="0">0</DeterminedClassification>\n' +
            '        <Classification label="motorbike" confidence="0" id="0"/>\n' +
            '        <Classification label="van" confidence="0" id="1"/>\n' +
            '        <Image cameraid="a" time="2001-12-17T09:30:47Z" type="frontshot" format="thumbnail" mimetype="a" href="image1" sha256="41394644363445313243" comment="a">\n' +
            '            <ec:CameraParameter name="a">String</ec:CameraParameter>\n' +
            '            <ec:CameraParameter name="a">String</ec:CameraParameter>\n' +
            '\n' +
            '        </Image>\n' +
            '        <Image cameraid="a" time="2001-12-17T09:30:47Z" type="backshot" format="thumbnail" mimetype="a" href="image2" sha256="41394644363445313243" comment="a">\n' +
            '            <ec:CameraParameter name="a">String</ec:CameraParameter>\n' +
            '            <ec:CameraParameter name="a">String</ec:CameraParameter>\n' +
            '        </Image>\n' +
            '    </cp:trafficevent>\n' +
            '</cp:trafficepoch>\n';

        // wait 1s to allow onTransactionDataRequest connection
        console.log(`wait 1s...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        ws.send(transaction, function ack(error) {
            error && console.error(error);
        });
    }

    /**
     * Response of files data
     */
    @Websocket('connection', '/efkon/no/dc/ctrl/cmd/response/files-uuid')
    async onTransactionFileResponse(ws) {
        let files = new JsonResponse({
            "files": [
                {
                    "filename": "file1",
                    "created": "2001-12-17T09:30:47Z",
                    "status": "transferred",
                    "time": "2001-12-17T09:30:47Z",
                    "history": [{"status": "queued", "time": "2001-12-17T09:30:47Z"}]
                },
                {
                    "filename": "file2",
                    "created": "2001-12-17T09:30:47Z",
                    "status": "queued",
                    "time": "2001-12-17T09:30:47Z",
                    "history": [{"status": "transferred", "time": "2001-12-17T09:30:47Z"}]
                }
            ],
            "status": "ok",
            "message": "message1",
        });

        // wait 1s to allow onTransactionFilesRequest connection
        console.log(`wait 1s...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        ws.send(JSON.stringify(files), function ack(error) {
            error && console.error(error);
        });
    }
}
