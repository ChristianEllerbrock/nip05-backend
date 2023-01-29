import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class AuthRegistrationCreateInput {
    @Field((type) => String)
    identifier!: string;

    @Field((type) => String)
    npub!: string;

    @Field((type) => String)
    relay!: string;
}

