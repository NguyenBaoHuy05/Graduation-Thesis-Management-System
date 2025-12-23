import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateCouncilInput } from './dto/create-council.input';
import { UpdateCouncilInput } from './dto/update-council.input';
import { rowToCouncil, rowsToCouncils } from './councils.transformer';
import { Council } from './councils.entity';

@Injectable()
export class CouncilsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(): Promise<Council[]> {
    const { data, error } = await this.supabase
      .getClient()
      .from('councils')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return rowsToCouncils(data);
  }

  async findOne(id: string): Promise<Council> {
    const { data, error } = await this.supabase
      .getClient()
      .from('councils')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return rowToCouncil(data);
  }

  async create(createCouncilInput: CreateCouncilInput): Promise<Council> {
    const councilData = {
      name: createCouncilInput.name,
      president_id: createCouncilInput.presidentId,
      secretary_id: createCouncilInput.secretaryId,
      reviewer_id: createCouncilInput.reviewerId,
      commissioner_id: createCouncilInput.commissionerId,
      member_ids: createCouncilInput.memberIds,
      period_id: createCouncilInput.periodId,
      topic_ids: createCouncilInput.topicIds,
      status: createCouncilInput.status || 'draft',
      description: createCouncilInput.description,
    };

    const { data, error } = await this.supabase
      .getClient()
      .from('councils')
      // @ts-ignore
      .insert([councilData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return rowToCouncil(data);
  }

  async update(
    id: string,
    updateCouncilInput: UpdateCouncilInput,
  ): Promise<Council> {
    const updateData: any = {};
    if (updateCouncilInput.name) updateData.name = updateCouncilInput.name;
    if (updateCouncilInput.presidentId)
      updateData.president_id = updateCouncilInput.presidentId;
    if (updateCouncilInput.secretaryId)
      updateData.secretary_id = updateCouncilInput.secretaryId;
    if (updateCouncilInput.reviewerId)
      updateData.reviewer_id = updateCouncilInput.reviewerId;
    if (updateCouncilInput.commissionerId !== undefined)
      updateData.commissioner_id = updateCouncilInput.commissionerId;
    if (updateCouncilInput.memberIds)
      updateData.member_ids = updateCouncilInput.memberIds;
    if (updateCouncilInput.topicIds)
      updateData.topic_ids = updateCouncilInput.topicIds;
    if (updateCouncilInput.status)
      updateData.status = updateCouncilInput.status;
    if (updateCouncilInput.description !== undefined)
      updateData.description = updateCouncilInput.description;

    // Scheduling fields
    if (updateCouncilInput.date !== undefined)
      updateData.date = updateCouncilInput.date;
    if (updateCouncilInput.time !== undefined)
      updateData.time = updateCouncilInput.time;
    if (updateCouncilInput.room !== undefined)
      updateData.room = updateCouncilInput.room;

    const { data, error } = await this.supabase
      .getClient()
      .from('councils')
      // @ts-ignore
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return rowToCouncil(data);
  }

  async remove(id: string): Promise<Council> {
    const { data, error } = await this.supabase
      .getClient()
      .from('councils')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return rowToCouncil(data);
  }
}
