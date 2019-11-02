import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { Certificate } from '../../app/models/Certificate';

export class CertificateMigration1566760085488 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.createTable(new Table({
            name: "certificate",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "path",
                    type: "varchar",
                },
                {
                    name: "name",
                    type: "varchar"
                }
            ]
        }), true);

        this.createDefaultCertificates();
    }

    private async createDefaultCertificates()
    {
        let certificate = new Certificate();
        certificate.name = "Security Day";
        certificate.path = "certificates/security-day.docx";
        certificate.save();

        certificate = new Certificate();
        certificate.name = "Fatecnologia";
        certificate.path = "certificates/fatecnologia.docx";
        certificate.save();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
