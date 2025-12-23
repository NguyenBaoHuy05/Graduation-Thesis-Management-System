import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  InputType,
  Field,
} from '@nestjs/graphql';
import { FormTemplate } from './formTemplates.entity';
import { FormTemplatesService } from './formTemplates.service';

@Resolver(() => FormTemplate)
export class FormTemplatesResolver {
  constructor(private formTemplatesService: FormTemplatesService) {}

  @Query(() => [FormTemplate])
  async formTemplates(): Promise<FormTemplate[]> {
    return this.formTemplatesService.findAll();
  }

  @Query(() => FormTemplate, { nullable: true })
  async formTemplate(@Args('id') id: string): Promise<FormTemplate> {
    return this.formTemplatesService.findOne(id);
  }

  @Mutation(() => FormTemplate)
  async createFormTemplate(
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('fileUrl') fileUrl: string,
    @Args('type')
    type: 'outline' | 'thesis' | 'report' | 'defense_request' | 'other',
  ): Promise<FormTemplate> {
    return this.formTemplatesService.create({
      name: name,
      description: description,
      file_url: fileUrl,
      type: type,
    });
  }

  @Mutation(() => FormTemplate)
  async updateFormTemplate(
    @Args('id') id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('fileUrl', { nullable: true }) fileUrl?: string,
    @Args('type', { nullable: true })
    type?: 'outline' | 'thesis' | 'report' | 'defense_request' | 'other',
  ): Promise<FormTemplate> {
    const payload: any = {};
    if (name) payload.name = name;
    if (description) payload.description = description;
    if (fileUrl) payload.file_url = fileUrl;
    if (type) payload.type = type;

    return this.formTemplatesService.update(id, payload);
  }

  @Mutation(() => Boolean)
  async deleteFormTemplate(@Args('id') id: string): Promise<boolean> {
    return this.formTemplatesService.delete(id);
  }
}
