import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as pactum from 'pactum';

import {AppModule} from '../src/app.module';
import {PrismaService} from '../src/prisma/prisma.service';
import {AuthDto} from '../src/auth/dto';
import {EditUserDto} from '../src/user/dto';
import {CreateCarArgs} from '../src/car/dto';

describe('App', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleTest: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleTest.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true
            })
        );

        await app.init();
        await app.listen(4444);

        prisma = app.get(PrismaService);
        await prisma.cleanDb();
        pactum.request.setBaseUrl('http://localhost:4444');
    });

    afterAll(() => {
        app.close();
    });

    describe('Auth', () => {
        const dto: AuthDto = {
            email: 'kotline@gmail.com',
            password: '123'
        };
        describe('Signup', () => {
            it('should throw if email empty', () =>
                pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({
                        password: dto.password
                    })
                    .expectStatus(400));
            it('should throw if password empty', () =>
                pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({
                        email: dto.email
                    })
                    .expectStatus(400));
            it('should throw if no body provided', () => pactum.spec().post('/auth/signup').expectStatus(400));
            it('should signup', () => pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201));
        });

        describe('Signin', () => {
            it('should throw if email empty', () =>
                pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody({
                        password: dto.password
                    })
                    .expectStatus(400));
            it('should throw if password empty', () =>
                pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody({
                        email: dto.email
                    })
                    .expectStatus(400));
            it('should throw if no body provided', () => pactum.spec().post('/auth/signin').expectStatus(400));
            it('should signin', () =>
                pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200).stores('userAt', 'access_token'));
        });
    });

    describe('User', () => {
        describe('Get me', () => {
            it('should get current user', () =>
                pactum
                    .spec()
                    .get('/user/me')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(200));
        });

        describe('Edit user', () => {
            it('should edit user', () => {
                const dto: EditUserDto = {
                    firstName: 'Serhii',
                    email: 'serhii@sonar.com'
                };

                return pactum
                    .spec()
                    .patch('/user/update/1')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody(dto)
                    .expectStatus(200)
                    .expectBodyContains(dto.firstName)
                    .expectBodyContains(dto.email);
            });
        });
    });

    describe('Cars', () => {
        describe('Get empty cars', () => {
            it('should get cars', () =>
                pactum
                    .spec()
                    .get('/car')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(200)
                    .expectBody([]));
        });

        describe('Create Cars', () => {
            const dto: CreateCarArgs = {
                model: 'Test X',
                transmission: 'Automation',
                mileage: 90000,
                ownerId: 1
            };
            it('should create bookmark', () =>
                pactum
                    .spec()
                    .post('/car')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody(dto)
                    .expectStatus(201)
                    .stores('carId', 'id'));
        });

        describe('Get car', () => {
            it('should get car', () =>
                pactum
                    .spec()
                    .get('/car')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(200)
                    .expectJsonLength(1));
        });

        describe('Get car by id', () => {
            it('should get car by id', () =>
                pactum
                    .spec()
                    .get('/car/{id}')
                    .withPathParams('id', '$S{carId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(200)
                    .expectBodyContains('$S{carId}'));
        });

        describe('Edit car by id', () => {
            const dto: CreateCarArgs = {
                model: 'Test Xl',
                transmission: 'Manual',
                mileage: 90100,
                ownerId: 1
            };
            it('should edit car', () =>
                pactum
                    .spec()
                    .patch('/car/update/{id}')
                    .withPathParams('id', '$S{carId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody(dto)
                    .expectStatus(200)
                    .expectBodyContains(dto.model)
                    .expectBodyContains(dto.transmission));
        });

        describe('Delete car by id', () => {
            it('should delete car', () =>
                pactum
                    .spec()
                    .delete('/car/delete/{id}')
                    .withPathParams('id', '$S{carId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(204));

            it('should get empty car', () =>
                pactum
                    .spec()
                    .get('/car')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(200)
                    .expectJsonLength(0));
        });
    });
});
