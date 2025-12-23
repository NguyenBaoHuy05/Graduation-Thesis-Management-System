import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CouncilsService } from './councils.service';
import { Council } from './councils.entity';
import { CreateCouncilInput } from './dto/create-council.input';
import { UpdateCouncilInput } from './dto/update-council.input';

@Resolver(() => Council)
export class CouncilsResolver {
  constructor(private readonly councilsService: CouncilsService) {}

  @Query(() => [Council], { name: 'councils' })
  findAll() {
    return this.councilsService.findAll();
  }

  @Query(() => Council, { name: 'council' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.councilsService.findOne(id);
  }

  @Mutation(() => Council)
  createCouncil(
    @Args('createCouncilInput') createCouncilInput: CreateCouncilInput,
  ) {
    return this.councilsService.create(createCouncilInput);
  }

  @Mutation(() => Council)
  updateCouncil(
    @Args('updateCouncilInput') updateCouncilInput: UpdateCouncilInput,
  ) {
    return this.councilsService.update(
      updateCouncilInput.id,
      updateCouncilInput,
    );
  }

  @Mutation(() => Council)
  deleteCouncil(@Args('id', { type: () => ID }) id: string) {
    return this.councilsService.remove(id);
  }
}
