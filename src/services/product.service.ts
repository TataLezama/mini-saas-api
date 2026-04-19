import { prisma } from "../configs";
import { ProductEntity } from "../database/entities/Product.entity";
import { CustomError } from "../errors/custom.error";
import { CreateProductDto, PaginationDto, UpdateProductDto } from "../modules";

export class ProductService {

    constructor() {}

    public async getProducts(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        try {

            const [total, products] = await Promise.all([
                prisma.product.count(),
                prisma.product.findMany({
                    skip: (page - 1) * limit,
                    take: limit
                }),
            ]);
            
            return {
                page: page,
                limit: limit,
                total: total,
                next:`/api/products?page=${ page + 1 }&limit=${ limit }`,
                previous: (page - 1 > 0) ? `/api/products?page=${ page - 1 }&limit=${ limit }` : null,
                products: products,
            }
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }
    }

    public async getProduct(id: string) {
        const productExist = await prisma.product.findUnique({ where: { id } });
        if (!productExist) throw CustomError.badRequest('Product not exist');

        const { ...productEntity } = ProductEntity.fromObject(productExist);

        return productEntity;
    }

    public async getProductsByCompany(companyId: string, paginationDto: PaginationDto) {
        const companyExist = await prisma.company.findUnique({ where: { id: companyId } });
        if (!companyExist) throw CustomError.badRequest('Company not exist');

        const { page, limit } = paginationDto;

        try {
            const [total, products] = await Promise.all([
                prisma.product.count(),
                prisma.product.findMany({
                    where: {
                        companyId: companyExist.id,
                    },
                    skip: (page - 1) * limit,
                    take: limit
                }),
            ]);
            
            return {
                page: page,
                limit: limit,
                total: total,
                next:`/api/products?page=${ page + 1 }&limit=${ limit }`,
                previous: (page - 1 > 0) ? `/api/products?page=${ page - 1 }&limit=${ limit }` : null,
                products: products,
            }
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }

    }

    public async createProduct( id: string, createProductDto: CreateProductDto ) {        
        const userExist = await prisma.user.findFirst({ where: { id } });
        if (!userExist) throw CustomError.badRequest('User not exist');
        if (!userExist.emailValidated) throw CustomError.badRequest('User not validated');
        if (userExist.id !== createProductDto.userId) throw CustomError.badRequest('You are not authorized');

        const companyExist = ( userExist.role === 'admin')
            ? await prisma.company.findFirst({ where: { id: createProductDto.companyId } })
            : await prisma.company.findFirst({
                where: {
                    id: createProductDto.companyId,
                    userId: userExist.id,
                },
        });
        if (!companyExist) throw CustomError.badRequest('Company not exist');
        if (!companyExist.active) throw CustomError.badRequest('Company not active');

        try {
            const product = await prisma.product.create({
                data: {
                    ...createProductDto,
                    companyId: companyExist.id,
                }
            });

            await prisma.product.update({
                where: { id: product.id },
                data: product,
            });

            return product;
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }
        
    }

    public async updateProduct( userId: string, id: string, updateProductDto: UpdateProductDto ) {
        // const userExist = await prisma.user.findFirst({ where: { id } });
        // if (!userExist) throw CustomError.badRequest('User not exist');
        // if (userExist.id !== updateProductDto.userId) throw CustomError.badRequest('User are not authorized');
        
        // const productExist = prisma.product.findFirst({
        //     where: { id },
        // });
        // if (!productExist) throw CustomError.badRequest('Product not exist');

        // try {
        //     if (updateProductDto.name !== '') productExist.name = updateProductDto.name ?? '';
        //     if (updateProductDto.description !== '') productExist.description = updateProductDto.description ?? '';
        //     if (updateProductDto.price) productExist.price = updateProductDto.price ?? 0;
        //     if (updateProductDto.image !== '') productExist.image = updateProductDto.image ?? '';
        //     if (updateProductDto.duration_minutes !== 0) productExist.duration_minutes = updateProductDto.duration_minutes ?? 0;
        //     if (updateProductDto.active) productExist.active = updateProductDto.active ?? false;
            
        //     await prisma.product.update({
        //         where: { id },
        //         data: productExist,
        //     });
            
        //     return productExist;
        // } catch (error) {
        //     throw CustomError.internalServerError(`${ error }`);
        // }
        
    }


}