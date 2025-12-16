import { Repository } from "typeorm";
import { Booking } from "../../domain/entities/Booking";
import { BookingRepository } from "../../domain/repositories/BookingRepository";
import { BookingEntity } from "../persistence/entities/BookingEntity";
import { BookingMapper } from "../persistence/mappers/BookingMapper";

export class TypeORMBookingRepository implements BookingRepository {
    private readonly repository: Repository<BookingEntity>;

    constructor(repository: Repository<BookingEntity>) {
        this.repository = repository;
    }

    async save(booking: Booking): Promise<void> {
        const bookingEntity = BookingMapper.toPersistence(booking);
        await this.repository.save(bookingEntity);
    }

    async findById(id: string): Promise<Booking | null> {
        const bookingEntity = await this.repository.findOne({
            where: { id },
            relations: [ "property", "guest" ],
        });
        return bookingEntity ? BookingMapper.toDomain(bookingEntity) : null ;
    }
}