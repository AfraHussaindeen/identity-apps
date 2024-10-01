/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import { FeatureAccessConfigInterface, FeatureStatus, useCheckFeatureStatus } from "@wso2is/access-control";
import { useOrganizationConfigV2 } from "@wso2is/admin.administrators.v1/api/useOrganizationConfigV2";
import { UseOrganizationConfigType } from "@wso2is/admin.administrators.v1/models/organization";
import { AppState, UserStoreProperty, getAUserStore, store } from "@wso2is/admin.core.v1";
import { userstoresConfig } from "@wso2is/admin.extensions.v1";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { useUserStores } from "@wso2is/admin.userstores.v1/api";
import { UserStoreDropdownItem, UserStoreListItem, UserStorePostData } from "@wso2is/admin.userstores.v1/models";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useSelector } from "react-redux";
import AdministratorsList from "./administrators-list/administrators-list";
import InvitedAdministratorsList from "./invited-administrators/invited-administrators-list";

/**
 * Props interface of {@link ConsoleAdministrators}
 */
type ConsoleAdministratorsInterface = IdentifiableComponentInterface;

/**
 * Component to render the login and security settings.
 *
 * @param props - Props injected to the component.
 * @returns Console login and security component.
 */
const ConsoleAdministrators: FunctionComponent<ConsoleAdministratorsInterface> = (
    props: ConsoleAdministratorsInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const { isFirstLevelOrganization, isSubOrganization } = useGetCurrentOrganizationType();

    const consoleSettingsFeatureConfig: FeatureAccessConfigInterface =
        useSelector((state: AppState) => state?.config?.ui?.features?.consoleSettings);
    const isPrivilegedUsersInConsoleSettingsEnabled: boolean =
        !consoleSettingsFeatureConfig?.disabledFeatures?.includes(
            "consoleSettings.privilegedUsers"
        );

    const [ activeAdministratorGroup, setActiveAdministratorGroup ] =
        useState(isSubOrganization() ? "activeUsers" : "administrators");
    const [ availableUserStores, setAvailableUserStores ] = useState<UserStoreDropdownItem[]>([]);
    const [ isEnterpriseLoginEnabled, setIsEnterpriseLoginEnabled ] = useState<boolean>(false);

    const organizationName: string = store.getState().auth.tenantDomain;

    const useOrgConfig: UseOrganizationConfigType = useOrganizationConfigV2;

    const saasFeatureStatus : FeatureStatus = useCheckFeatureStatus(
        FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);

    const {
        data: OrganizationConfig,
        isLoading: isOrgConfigRequestLoading,
        isValidating: isOrgConfigRequestRevalidating
    } = useOrgConfig(
        organizationName,
        {
            revalidateIfStale: true
        },
        saasFeatureStatus === FeatureStatus.ENABLED
    );

    useEffect(() => {
        setIsEnterpriseLoginEnabled(OrganizationConfig?.isEnterpriseLoginEnabled);
    }, [ isOrgConfigRequestLoading, isOrgConfigRequestRevalidating ]);

    const {
        data: userStoreList,
        isLoading: isUserStoreListFetchRequestLoading
    } = useUserStores(null);

    useEffect(() => {
        if (userStoreList && !isUserStoreListFetchRequestLoading) {
            const storeOptions: UserStoreDropdownItem[] = [
                {
                    key: -1,
                    text: userstoresConfig?.primaryUserstoreName,
                    value: userstoresConfig?.primaryUserstoreName
                }
            ];

            let storeOption: UserStoreDropdownItem = {
                key: null,
                text: "",
                value: ""
            };

            userStoreList?.forEach((store: UserStoreListItem, index: number) => {
                if (store?.name?.toUpperCase() !== userstoresConfig?.primaryUserstoreName) {
                    getAUserStore(store.id).then((response: UserStorePostData) => {
                        const isDisabled: boolean = response.properties.find(
                            (property: UserStoreProperty) => property.name === "Disabled")?.value === "true";

                        if (!isDisabled) {
                            storeOption = {
                                key: index,
                                text: store.name,
                                value: store.name
                            };
                            storeOptions.push(storeOption);
                        }
                    });
                }
            });

            setAvailableUserStores(storeOptions);
        }
    }, [ userStoreList, isUserStoreListFetchRequestLoading ]);

    const renderSelectedAdministratorGroup = (): ReactElement => {
        switch (activeAdministratorGroup) {
            case "activeUsers":
                return (
                    <AdministratorsList
                        selectedAdministratorGroup={ activeAdministratorGroup }
                        availableUserStores={ availableUserStores }
                    />
                );
            case "administrators":
                return (
                    <AdministratorsList
                        selectedAdministratorGroup={ activeAdministratorGroup }
                        availableUserStores={ availableUserStores }
                    />
                );
            case "privilegedUsers":
                return (
                    <AdministratorsList
                        selectedAdministratorGroup={ activeAdministratorGroup }
                        availableUserStores={ availableUserStores }
                    />
                );
            case "pendingInvitations":
                return (
                    <InvitedAdministratorsList
                        availableUserStores={ availableUserStores }
                    />
                );
            default:
                return null;
        }
    };

    const renderActiveAdministratorGroups = (): ReactElement => {
        if (
            isFirstLevelOrganization()
            && isEnterpriseLoginEnabled
            && isPrivilegedUsersInConsoleSettingsEnabled
        ) {
            return (
                <RadioGroup
                    row
                    aria-labelledby="console-administrators-radio-group"
                    className="multi-option-radio-group"
                    defaultValue="administrators"
                    name="console-administrators-radio-group"
                    value={ activeAdministratorGroup }
                    onChange={ (_: ChangeEvent<HTMLInputElement>, value: string) => setActiveAdministratorGroup(value) }
                >
                    <FormControlLabel value="administrators" control={ <Radio /> } label="Administrators" />
                    <FormControlLabel value="privilegedUsers" control={ <Radio /> } label="Privileged Users" />
                </RadioGroup>
            );
        }

        if (isSubOrganization()) {
            return (
                <RadioGroup
                    row
                    aria-labelledby="console-administrators-radio-group"
                    className="multi-option-radio-group"
                    defaultValue="login"
                    name="console-administrators-radio-group"
                    value={ activeAdministratorGroup }
                    onChange={ (_: ChangeEvent<HTMLInputElement>, value: string) => setActiveAdministratorGroup(value) }
                >
                    <FormControlLabel value="activeUsers" control={ <Radio /> } label="Active Members" />
                    <FormControlLabel value="pendingInvitations" control={ <Radio /> } label="Pending Invitations" />
                </RadioGroup>
            );
        }
    };

    return (
        <div className="console-administrators" data-componentid={ componentId }>
            { renderActiveAdministratorGroups() }
            { renderSelectedAdministratorGroup() }
        </div>
    );
};

/**
 * Default props for the component.
 */
ConsoleAdministrators.defaultProps = {
    "data-componentid": "console-administrators"
};

export default ConsoleAdministrators;
