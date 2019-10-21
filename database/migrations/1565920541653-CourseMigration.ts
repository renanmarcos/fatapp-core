import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { Course } from '../../app/models/Course';

export class CourseMigration1565920541653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "course",
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
                },
                {
                    name: "acronym",
                    type: "varchar"
                }
            ]
        }), true);

        this.createCourses();
    }

    private async createCourses() {
        let course = new Course();
        course.name = "Análise e Desenvolvimento de Sistemas";
        course.acronym = "ADS";
        await course.save();
    
        course = new Course();
        course.name = "Jogos Digitais";
        course.acronym = "JOG";
        await course.save();
    
        course = new Course();
        course.name = "Segurança da Informação";
        course.acronym = "SEG";
        await course.save();
    
        course = new Course();
        course.name = "Gestão Empresarial";
        course.acronym = "GES";
        await course.save();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
