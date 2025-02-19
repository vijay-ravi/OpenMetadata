/*
 *  Copyright 2022 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { AxiosResponse } from 'axios';
import { Operation } from 'fast-json-patch';
import { PagingResponse } from 'Models';
import { PAGE_SIZE } from '../constants/constants';
import { CreateClassification } from '../generated/api/classification/createClassification';
import { CreateTag } from '../generated/api/classification/createTag';
import { Classification } from '../generated/entity/classification/classification';
import { Tag } from '../generated/entity/classification/tag';
import { EntityHistory } from '../generated/type/entityHistory';
import { ListParams } from '../interface/API.interface';
import APIClient from './index';

const BASE_URL = '/classifications';

interface TagsRequestParams {
  fields?: string | string[];
  parent?: string;
  after?: string;
  before?: string;
  limit?: number;
}

export const getTags = async ({ limit = 10, ...params }: TagsRequestParams) => {
  const response = await APIClient.get<PagingResponse<Tag[]>>('/tags', {
    params: { ...params, limit },
  });

  return response.data;
};

export const getAllClassifications = async (params?: ListParams) => {
  const response = await APIClient.get<PagingResponse<Classification[]>>(
    BASE_URL,
    {
      params: {
        ...params,
        limit: params?.limit ?? PAGE_SIZE,
      },
    }
  );

  return response.data;
};

export const getClassificationByName = async (
  name: string,
  params?: ListParams
) => {
  const response = await APIClient.get<Classification>(
    `${BASE_URL}/name/${name}`,
    { params }
  );

  return response.data;
};

export const deleteClassification = async (classificationId: string) => {
  const response = await APIClient.delete<Classification>(
    `/classifications/${classificationId}?recursive=true&hardDelete=true`
  );

  return response.data;
};

export const createClassification = async (data: CreateClassification) => {
  const response = await APIClient.post<
    CreateClassification,
    AxiosResponse<Classification>
  >(BASE_URL, data);

  return response.data;
};
export const updateClassification = async (data: Classification) => {
  const response = await APIClient.put<
    Classification,
    AxiosResponse<Classification>
  >(`/classifications`, data);

  return response.data;
};
export const patchClassification = async (id: string, data: Operation[]) => {
  const configOptions = {
    headers: { 'Content-type': 'application/json-patch+json' },
  };
  const response = await APIClient.patch<
    Operation[],
    AxiosResponse<Classification>
  >(`${BASE_URL}/${id}`, data, configOptions);

  return response.data;
};

export const getTagByFqn = async (fqn: string, params?: ListParams) => {
  const response = await APIClient.get<Tag>(`tags/name/${fqn}`, {
    params,
  });

  return response.data;
};

export const createTag = async (data: CreateTag) => {
  const response = await APIClient.post<CreateTag, AxiosResponse<Tag>>(
    `/tags`,
    data
  );

  return response.data;
};

export const updateTag = async (data: Classification) => {
  const response = await APIClient.put(`/tags`, data);

  return response.data;
};

export const patchTag = async (id: string, data: Operation[]) => {
  const configOptions = {
    headers: { 'Content-type': 'application/json-patch+json' },
  };
  const response = await APIClient.patch<Operation[], AxiosResponse<Tag>>(
    `/tags/${id}`,
    data,
    configOptions
  );

  return response.data;
};

export const deleteTag = async (tagId: string) => {
  const response = await APIClient.delete(`/tags/${tagId}`, {
    // Todo: need to update below params in new implementation, for now providing hardDelete true,
    // to avoid soft delete issue from UI
    params: {
      recursive: true,
      hardDelete: true,
    },
  });

  return response.data;
};

export const getClassificationVersionsList = async (id: string) => {
  const url = `${BASE_URL}/${id}/versions`;

  const response = await APIClient.get<EntityHistory>(url);

  return response.data;
};

export const getClassificationVersionData = async (
  id: string,
  version: string
) => {
  const url = `${BASE_URL}/${id}/versions/${version}`;

  const response = await APIClient.get<Classification>(url);

  return response.data;
};
