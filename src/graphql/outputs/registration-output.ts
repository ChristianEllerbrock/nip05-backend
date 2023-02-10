import { Field, Int, ObjectType } from "type-graphql";
import { RegistrationCodeOutput } from "./registration-code-output";
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

    @Field((type) => String)
    identifier!: string;

    @Field((type) => Date)
    createdAt!: Date;

    @Field((type) => Date)
    validUntil!: Date;

    @Field((type) => Date, { nullable: true })
    verifiedAt!: Date | null;

    @Field((type) => Int)
    nipped!: number;

    // Model Relations

    @Field((type) => UserOutput)
    user?: UserOutput;

    @Field((type) => RegistrationCodeOutput, { nullable: true })
    registrationCode?: RegistrationCodeOutput | null;
}

