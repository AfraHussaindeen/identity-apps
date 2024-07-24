/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * This class contains the constants for the Federated Authenticators.
 */
export class FederatedAuthenticatorConstants {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    public static readonly AUTHENTICATOR_IDS: {
        APPLE_AUTHENTICATOR_ID: string;
        FACEBOOK_AUTHENTICATOR_ID: string;
        GITHUB_AUTHENTICATOR_ID: string;
        GOOGLE_OIDC_AUTHENTICATOR_ID: string;
        HYPR_AUTHENTICATOR_ID: string;
        MICROSOFT_AUTHENTICATOR_ID: string;
        ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID: string;
        SIWE_AUTHENTICATOR_ID: string;
        TWITTER_AUTHENTICATOR_ID: string;
    } = {
            APPLE_AUTHENTICATOR_ID: "QXBwbGVPSURDQXV0aGVudGljYXRvcg",
            FACEBOOK_AUTHENTICATOR_ID: "RmFjZWJvb2tBdXRoZW50aWNhdG9y",
            GITHUB_AUTHENTICATOR_ID: "R2l0aHViQXV0aGVudGljYXRvcg",
            GOOGLE_OIDC_AUTHENTICATOR_ID: "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I",
            HYPR_AUTHENTICATOR_ID: "SFlQUkF1dGhlbnRpY2F0b3I",
            MICROSOFT_AUTHENTICATOR_ID: "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I",
            ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID: "T3JnYW5pemF0aW9uQXV0aGVudGljYXRvcg",
            SIWE_AUTHENTICATOR_ID: "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I",
            TWITTER_AUTHENTICATOR_ID: "VHdpdHRlckF1dGhlbnRpY2F0b3I"
        };

    /**
     * Google One Tap enabling request parameter.
     */
    public static readonly GOOGLE_ONE_TAP_ENABLED_PARAM: string = "IsGoogleOneTapEnabled";

    /**
     * Google Scope mappings.
     */
    public static readonly GOOGLE_SCOPE_DICTIONARY: Record<string, string> = {
        EMAIL: "email",
        OPENID: "openid",
        PROFILE: "profile"
    };

    /**
     * Microsoft Scope mappings.
     */
    public static readonly MICROSOFT_SCOPE_DICTIONARY: Record<string, string> = {
        EMAIL: "email",
        OPENID: "openid",
        PROFILE: "profile"
    };

    /**
     * GitHub Scope mappings.
     */
    public static readonly GITHUB_SCOPE_DICTIONARY: Record<string, string> = {
        USER_EMAIL: "user:email",
        USER_READ: "read:user"
    };

    /**
     * Facebook Scope mappings.
     */
    public static readonly FACEBOOK_SCOPE_DICTIONARY: Record<string, string> = {
        EMAIL: "email",
        PUBLIC_PROFILE: "public_profile"
    };

    /**
     * Apple scope mappings.
     */
    public static readonly APPLE_SCOPE_DICTIONARY: Record<string, string> = {
        EMAIL: "email",
        NAME: "name"
    };

    /**
     * Key of the Apple client secret regenerate attribute.
     */
    public static readonly APPLE_SECRET_REGENERATE_ATTRIBUTE_KEY: string = "RegenerateClientSecret";
}
