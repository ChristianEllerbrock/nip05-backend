import { Field, ObjectType } from "type-graphql";

@ObjectType("UserOutput", { isAbstract: true, simpleResolvers: true })
export class UserOutput {
    @Field((type) => String)
    id!: string;

    @Field((type) => String)
    pubkey!: string;

    @Field((type) => String, { nullable: true })
    identifier!: string | null;

    @Field((type) => Boolean)
    isActivated!: boolean;

    @Field((type) => Date)
    createdAt!: Date;
}

