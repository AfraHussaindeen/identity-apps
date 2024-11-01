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

import { RequestErrorInterface, RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import components from "../data/components.json";
import { Components } from "../models/components";

/**
 * Hook to get the components supported by the authentication flow builder.
 *
 * This function calls the GET method of the following endpoint to get the components.
 * - TODO: Fill this
 * For more details, refer to the documentation:
 * {@link TODO: Fill this}
 *
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetAuthenticationFlowBuilderComponents = <Data = Components, Error = RequestErrorInterface>(
    _shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    return {
        data: (components as unknown) as Data,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: () => null
    };
};

export default useGetAuthenticationFlowBuilderComponents;
