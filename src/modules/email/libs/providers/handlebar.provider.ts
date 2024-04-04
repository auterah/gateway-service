import { Logger } from '@nestjs/common';
import * as handlebars from 'handlebars';
import { promisify } from 'util';
import { resolve } from 'path';
import { readFile } from 'fs'; 
import { ITemplateProvider } from '../../interfaces/mail_template';

const ReadFile = promisify(readFile);

export class HBSProvider implements ITemplateProvider {
  private logger: Logger;
  public name = HBSProvider.name;

  constructor() {
    this.logger = new Logger(HBSProvider.name);
  }
  async generateTemplate(templateName: string, context?: any): Promise<string> {
    this.logger.log(`Generating ${templateName} template...`);
    const mailsTemplate = `./src/templates/${templateName}.hbs`;

    const templatePath = resolve(mailsTemplate);
    const content = await ReadFile(templatePath);
    return this.compileTextToHBS(content.toString(), context);
  }

  async encodedHTMLToHBS(encodedHTML: string, context?: any): Promise<string> {
    const decodedHTML = atob(encodedHTML);
    return this.compileTextToHBS(decodedHTML, context);
  }

  compileTextToHBS(content: string, context?: any) {
    handlebars.registerHelper('ifeq', function (a, b, options) {
      if (a == b) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
      switch (operator) {
        case '===':
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    });

    const template = handlebars.compile(content);
    return template(context);
  }
}
