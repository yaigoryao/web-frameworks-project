import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import yaml from 'js-yaml';

export function setupSwagger(document: OpenAPIObject, app: INestApplication) {
    app.getHttpAdapter().get('/openapi.yaml', (req, res) => {
        res.setHeader('Content-Type', 'text/yaml');
        res.send(yaml.dump(document, { indent: 2 }));
    });
}