import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { Pageable } from 'src/shared/base-paginated-filter.dto';
import { FilteredPaginatedQuery } from 'src/shared/filtered-query.decorator';
import { PaginatedResult } from 'src/shared/paginated-result.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { IngredientSearchResult } from '../ingredients/dto/ingredients-search-results.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { IngredientQuantityDto } from './dto/ingredient-quantity.dto';
import { RecipeFilterDto } from './dto/recipe-filter.dto';
import { ReorderDto } from './dto/reorder.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { Recipe } from './entities/recipe.entity';
import { RecipeService } from './recipe.service';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Recipe> {
    return this.recipeService.findOne(id);
  }
  @Get()
  @FilteredPaginatedQuery(Recipe)
  async findAll(
    @Query() filter: RecipeFilterDto,
    pageable: Pageable
  ): Promise<PaginatedResult<Recipe>> {
    const results = await this.recipeService.findAll(filter, pageable);
    return new PaginatedResult<Recipe>(...results);
  }

  @Post(':id/ingredients')
  async associateNewIngredient(
    @Param('id') id: string,
    @Body() newIngredient: Pick<IngredientSearchResult, 'foodName'>
  ): Promise<RecipeIngredient> {
    return this.recipeService.associateNewIngredient(id, newIngredient);
  }

  @Post(':id')
  async reorderIngredients(
    @Param('id') id: string,
    @Body() { from, to, ingredientId }: ReorderDto
  ) {
    return this.recipeService.reorderIngredients(id, ingredientId, from, to);
  }

  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipeService.create(createRecipeDto);
  }

  @Put(':id/ingredients')
  async associateIngredient(
    @Param('id') id: string,
    @Body() ingredient: IngredientSearchResult
  ): Promise<RecipeIngredient> {
    return this.recipeService.associateIngredient(id, ingredient);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    return this.recipeService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.recipeService.remove(id);
  }

  @Patch(':id/ingredients/:ingredientId')
  async setIngredientQuantity(
    @Param('id') id: string,
    @Param('ingredientId') ingredientId: string,
    @Body() quantityDto: IngredientQuantityDto
  ): Promise<UpdateResult> {
    return this.recipeService.setIngredientQuantity(id, ingredientId, quantityDto);
  }

  @Delete(':id/ingredients/:ingredientId')
  async removeIngredient(
    @Param('id') id: string,
    @Param('ingredientId') ingredientId: string
  ): Promise<DeleteResult> {
    return this.recipeService.dissociateIngredient(id, ingredientId);
  }
}
