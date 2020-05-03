/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PrimaryButton } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { deleteEmailTemplateType, getEmailTemplateTypes } from "../api";
import { EmailTemplateTypeList, EmailTemplateTypeWizard } from "../components/email-templates";
import { UIConstants } from "../constants";
import { ListLayout, PageLayout } from "../layouts";
import { AlertInterface, EmailTemplateType } from "../models";

/**
 * Component to list available email template types.
 */
export const EmailTemplateTypes = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ showNewTypeWizard, setShowNewTypeWizard ] = useState<boolean>(false);
    
    const [ emailTemplateTypes, setEmailTemplateTypes ] = useState<EmailTemplateType[]>([]);
    const [ paginatedEmailTemplateTypes, setPaginatedEmailTemplateTypes ] = useState<EmailTemplateType[]>([]);
    const [ isTemplateTypesFetchRequestLoading, setIsTemplateTypesFetchRequestLoading ] = useState<boolean>(false);

    useEffect(() => {
        getTemplateTypes()
    }, [emailTemplateTypes.length]);

    const getTemplateTypes = (): void => {
        setIsTemplateTypesFetchRequestLoading(true);

        getEmailTemplateTypes()
            .then((response: AxiosResponse<EmailTemplateType[]>) => {
                if (response.status === 200) {
                    setEmailTemplateTypes(response.data);
                    setEmailTemplateTypePage(listOffset, listItemLimit);
                }
            })
            .finally(() => {
                setIsTemplateTypesFetchRequestLoading(false);
            });
    };

    /**
     * Handler for pagination page change.
     * 
     * @param event pagination page change event
     * @param data pagination page change data
     */
    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue = (data.activePage as number - 1) * listItemLimit;
        setListOffset(offsetValue);
        setEmailTemplateTypePage(offsetValue, listItemLimit);
    };

    /**
     * Handler for Items per page dropdown change.
     * 
     * @param event drop down event
     * @param data drop down data
     */
    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
        setEmailTemplateTypePage(listOffset, data.value as number);
    };

    /**
     * Util method to paginate retrieved email template type list.
     * 
     * @param offsetValue pagination offset value
     * @param itemLimit pagination item limit
     */
    const setEmailTemplateTypePage = (offsetValue: number, itemLimit: number) => {
        setPaginatedEmailTemplateTypes(emailTemplateTypes?.slice(offsetValue, itemLimit + offsetValue));
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    const deleteTemplateType = (templateTypeId: string) => {
        deleteEmailTemplateType(templateTypeId).then((response: AxiosResponse) => {
            if (response.status === 204) {
                handleAlerts({
                    description: t(
                        "devPortal:components.emailTemplateTypes.notifications.deleteTemplateType.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "devPortal:components.emailTemplateTypes.notifications.deleteTemplateType.success.message"
                    )
                });
            }
            getTemplateTypes();
        }).catch((error: AxiosError) => {
            handleAlerts({
                description: error.response.data.description,
                level: AlertLevels.ERROR,
                message: t(
                    "devPortal:components.emailTemplateTypes.notifications.deleteTemplateType.genericError.message"
                )
            });
        })
    };

    return (
        <PageLayout
            isLoading={ isTemplateTypesFetchRequestLoading }
            title="Email Templates Types"
            description="Create and manage templates types."
            showBottomDivider={ true } 
        >
            <ListLayout
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                totalPages={ Math.ceil(emailTemplateTypes?.length / listItemLimit) }
                totalListSize={ emailTemplateTypes?.length }
                rightActionPanel={
                    (
                        <PrimaryButton onClick={ () => setShowNewTypeWizard(true) }>
                            <Icon name="add"/>
                            New Template Type
                        </PrimaryButton>
                    )
                }
            >
                <EmailTemplateTypeList
                    isLoading={ isTemplateTypesFetchRequestLoading }
                    onDelete={ deleteTemplateType }
                    onEmptyListPlaceholderActionClick={ () => setShowNewTypeWizard(true) }
                    templateTypeList={ paginatedEmailTemplateTypes } 
                />
                {
                    showNewTypeWizard && (
                        <EmailTemplateTypeWizard
                            onCloseHandler={ () => {
                                getTemplateTypes();
                                setShowNewTypeWizard(false);
                            } }
                        />
                    ) 
                }
            </ListLayout>
        </PageLayout>
    )
};
