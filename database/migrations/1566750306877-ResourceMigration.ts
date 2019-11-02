import {MigrationInterface, QueryRunner, Table} from "typeorm";
import {Resource} from '../../app/models/Resource';

export class ResourceMigration1566750306877 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "resource",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "name",
                    type: "varchar",
                }
            ]
        }), true);
        
        this.createResources();
    }

    private async createResources() {
        let resource = new Resource();
        resource.name = "Computador";
        await resource.save();
    
        resource = new Resource();
        resource.name = "Projetor";
        await resource.save();
    
        resource = new Resource();
        resource.name = "Caixas de Som";
        await resource.save();

        resource = new Resource();
        resource.name = "Marcador de quadro";
        await resource.save();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
