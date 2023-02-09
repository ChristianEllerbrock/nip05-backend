import { Field, ObjectType } from "type-graphql";
import { UserOutput } from "./user-output";

@ObjectType("RegistrationOutput", {
    isAbstract: true,
    simpleResolvers: true,
})
export class RegistrationOutput {
    @Field((type) => String)
    id!: string;

    @Field((type) => String)
    userId!: string;

    @Field((type) => Date)
    createdAt!: Date;

    @Field((type) => Date)
    validUntil!: Date;

    @Field((type) => Date, { nullable: true })
    verifiedAt!: Date | null;

    // Model Relations

    @Field((type) => UserOutput)
    user?: UserOutput;
}

