import {TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings, UserServiceBindings
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody, SchemaObject} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile as SecurityUserProfile} from '@loopback/security';
import {UserProfileRepository} from '../repositories';

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 2,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: SecurityUserProfile,
    @repository(UserProfileRepository) protected userProfileRepository: UserProfileRepository,
  ) { }

  @post('/user/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<any> {
    // ensure the user exists, and the password is correct
    const user = await this.userProfileRepository.findOne({
      where: {and: [{email: credentials.email}, {isActive: true}]}, fields: {userProfileId: true, email: true, roleId: true, password: true}, include: ['role']
    });

    if (!user || user.password !== credentials.password) {
      throw new HttpErrors.Unauthorized('Invalid email or password.');
    }
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = {
      [securityId]: user.userProfileId.toString(),
      id: user.userProfileId,
      email: user.email,
      roleId: user.roleId,
      imagePath: user.imagePath
    };


    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {id: user.userProfileId, role: user.role?.roleName, token: token};
  }

}
