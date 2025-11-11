<template>
  <PageBreadcrumb :items="breadcrumbItems" />
  <PageTitle :name="pageTitle" :loading="isLoading" />

  <PageContent>
    <Form class="grid gap-4" @submit="onSubmit">
      <PageContentSection :title="t('personalInfo')">
        <Row>
          <Col :md="12">
            <InputField required name="firstName" :label="t('firstName')" />
          </Col>
          <Col :md="12">
            <InputField required name="lastName" :label="t('lastName')" />
          </Col>
          <Col :md="12">
            <InputField required name="email" :label="t('email')" />
          </Col>
        </Row>
      </PageContentSection>

      <PageContentSection :title="t('additionalInfo')">
        <Row>
          <Col :md="12">
            <SelectField
              required
              name="roleId"
              :label="t('role.label')"
              :options="roleOptions"
              option-label="label"
              option-value="value"
            />
          </Col>
          <Col :md="12">
            <SelectField
              name="statusId"
              :label="t('status')"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              show-clear
            />
          </Col>
        </Row>
      </PageContentSection>

      <PageContentSection :title="t('loginInfo')">
        <Row>
          <Col :md="12">
            <PasswordField name="password" :label="t('password')" :required="false" />
          </Col>
        </Row>
      </PageContentSection>

      <div class="flex justify-end gap-2">
        <CancelButton />
        <UpdateButton :loading="isPending" />
      </div>
    </Form>
  </PageContent>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import {
  CancelButton,
  Col,
  Form,
  InputField,
  SelectField,
  PageBreadcrumb,
  PageContent,
  PageContentSection,
  PageTitle,
  PasswordField,
  Row,
  UpdateButton
} from '@/components';
import { useFormAsync, useTranslation } from '@/composables';
import { AppRoute } from '@/constants';
import type { BreadcrumbItemProps } from '@/types';

import { useUpdateUserMutation, useUserFormQuery } from '../composables/useUserQuery';
import { updateUserValidationSchema } from '../user-schema';
import type { EditUserForm } from '../user-type';

const { t } = useTranslation();
const { params } = useRoute();

const breadcrumbItems = computed<BreadcrumbItemProps[]>(() => [
  {
    title: t('user.list'),
    to: AppRoute.USER
  },
  {
    title: t('edit')
  }
]);

const userId = params.id as string;

const { isLoading, data } = useUserFormQuery(userId);

const { handleSubmit } = useFormAsync<EditUserForm>({
  initialValues: data,
  validationSchema: toTypedSchema(updateUserValidationSchema)
});

const { isPending, mutate } = useUpdateUserMutation(userId);

const roleOptions = computed(() => [
  { label: t('role.options.admin'), value: 1 },
  { label: t('role.options.user'), value: 2 }
]);

const statusOptions = computed(() => [
  { label: t('active'), value: 1 },
  { label: t('deactivated'), value: 2 }
]);

const pageTitle = computed(() => {
  const user = data.value;
  if (!user) {
    return t('user.edit');
  }
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
  return fullName || user.email || t('user.edit');
});

const onSubmit = handleSubmit((formValues) => {
  mutate(formValues);
});
</script>

<style scoped></style>
