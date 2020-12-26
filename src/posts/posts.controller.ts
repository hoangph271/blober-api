import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DEFAULT_TAKE_COUNT } from './constants';
import { Post } from './posts.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findPosts(
    @Query('skip') skip = 0,
    @Query('take') take: number = DEFAULT_TAKE_COUNT,
  ) {
    // TODO: https://github.com/nestjs/nest/issues/4713
    // * Validate skip & limit
    // * For now, the server dies when skip or limit is NOT a number
    const posts = await this.postsService.findManyBy({
      skip,
      take,
      relations: [Post.relations.pics],
    });

    return {
      count: posts.length,
      // TODO: Remove this Number() after above steps
      nextSkip: Number(skip) + posts.length,
      posts,
    };
  }
}
