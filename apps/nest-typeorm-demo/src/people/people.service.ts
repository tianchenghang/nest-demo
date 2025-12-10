import { Injectable } from '@nestjs/common';
import { CreatePeopleDto } from './dto/create-people.dto';
import { UpdatePeopleDto } from './dto/update-people.dto';
import { People } from './entities/people.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Like, Repository } from 'typeorm';
import { Email } from './entities/email.entity';

interface ICond {
  partialName: string;
  page: number;
  pageSize: number;
}

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepo: Repository<People>,
    @InjectRepository(Email)
    private readonly emailRepo: Repository<Email>,
  ) {}

  create(createPeopleDto: CreatePeopleDto) {
    const people = new People();
    people.name = createPeopleDto.name;
    people.age = createPeopleDto.age;

    return this.peopleRepo.save(people);
  }

  async findAll(cond: ICond) {
    const { partialName, page, pageSize } = cond;
    // const peopleListPromise = this.peopleRepo.find({
    //   where: { name: Like(`%${partialName}%`) },
    //   order: { id: 'DESC' },
    //   skip: (page - 1) * pageSize,
    //   take: pageSize,
    // });

    // const totalPromise = this.peopleRepo.count({
    //   where: { name: Like(`%${partialName}%`) },
    // });

    // const [peopleList, total] = await Promise.all([
    //   peopleListPromise,
    //   totalPromise,
    // ]);

    const [peopleList, totalCount] = await this.peopleRepo.findAndCount({
      where: { name: Like(`%${partialName}%`) },
      // order: { id: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['emailList'],
    });

    // for (const people of peopleList) {
    //   const emailList = await this.findAllEmail(people.id);
    //   people.emailList = emailList;
    // }

    return {
      peopleList,
      totalCount,
    };
  }

  async findOne(id: number) {
    return await this.peopleRepo.findOne({ where: { id } });
  }

  async findOneEmail(emailAddr: string) {
    return await this.emailRepo.findOne({
      where: { addr: Equal(emailAddr) },
      relations: ['people'],
    });
  }

  async findAllEmail(peopleId: number) {
    return await this.emailRepo
      .createQueryBuilder('email')
      .where('email.peopleId = :peopleId', { peopleId })
      .getMany();
  }

  async update(id: number, updatePeopleDto: UpdatePeopleDto) {
    return this.peopleRepo.update(id, updatePeopleDto);
  }

  remove(id: number) {
    return Promise.all([
      this.peopleRepo.delete(id),
      this.emailRepo.delete({ people: { id } }),
    ]);
  }

  // transaction
  async swapEmail(emailAddr: string, emailAddr2: string) {
    if (!emailAddr || !emailAddr2) {
      return;
    }

    // 事务
    return this.emailRepo.manager.transaction(async (manager) => {
      const [email, email2] = await Promise.all([
        this.findOneEmail(emailAddr),
        this.findOneEmail(emailAddr2),
      ]);
      if (email && email2 && email.people.id !== email2.people.id) {
        await Promise.all([
          manager.save(Email, { ...email, people: email2.people }),
          manager.save(Email, { ...email2, people: email.people }),
        ]);
      }
    });
  }

  async addEmail(peopleId: number, addr: string) {
    const people = await this.findOne(peopleId);
    if (!people) {
      throw new Error(`#${peopleId} people not found`);
    }

    const email = new Email();
    email.addr = addr;
    email.people = people;

    await this.emailRepo
      .save(email)
      .catch((err) => console.error('[addEmail] err:', err));
  }
}
