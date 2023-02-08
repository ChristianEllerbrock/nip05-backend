import { Field, ObjectType } from "type-graphql";

@ObjectType("RegistrationRequestOutput", {
    isAbstract: true,
    simpleResolvers: true,
})
export class RegistrationRequestOutput {
    @Field((type) => String)
    id!: string;

    @Field((type) => String)
    userId!: string;

    @Field((type) => String)
    identifier!: string;

    @Field((type) => Date)
    createdAt!: Date;

    @Field((type) => Date)
    validUntil!: Date;
}

