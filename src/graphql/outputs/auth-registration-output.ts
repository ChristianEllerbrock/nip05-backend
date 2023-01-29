import { Field, ObjectType } from "type-graphql";

@ObjectType("AuthRegistrationOutput", {
    isAbstract: true,
    simpleResolvers: true,
})
export class AuthRegistrationOutput {
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

