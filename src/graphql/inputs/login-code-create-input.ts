import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class LoginCodeCreateInput {
    @Field((type) => String)
    npub!: string;

    @Field((type) => String)
    relay!: string;
}

