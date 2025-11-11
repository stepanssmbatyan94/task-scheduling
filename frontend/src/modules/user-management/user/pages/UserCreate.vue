<template>
  <PageBreadcrumb :items="breadcrumbItems" />
  <PageTitle :name="t('user.addNew')" />

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
            <PasswordField required name="password" :label="t('password')" />
          </Col>
          <Col :md="12">
            <PasswordField required name="confirmPassword" :label="t('confirmPassword')" />
          </Col>
        </Row>
      </PageContentSection>

      <div class="flex justify-end gap-2">
        <CancelButton />
        <SaveButton :loading="isPending" />
      </div>
    </Form>
  </PageContent>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { computed } from 'vue';

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
  SaveButton
} from '@/components';
import { useFormAsync, useTranslation } from '@/composables';
import { AppRoute } from '@/constants';
import type { BreadcrumbItemProps } from '@/types';
import { useCreateUserMutation } from '../composables/useUserQuery';
import { createUserValidationSchema } from '../user-schema';
import type { CreateUserForm } from '../user-type';

const { t } = useTranslation();

const breadcrumbItems = computed<BreadcrumbItemProps[]>(() => [
  {
    title: t('user.list'),
    to: AppRoute.USER
  },
  {
    title: t('create')
  }
]);

const { handleSubmit } = useFormAsync<CreateUserForm>({
  validationSchema: toTypedSchema(createUserValidationSchema)
});

const { isPending, mutate } = useCreateUserMutation();

const roleOptions = computed(() => [
  { label: t('role.options.admin'), value: 1 },
  { label: t('role.options.user'), value: 2 }
]);

const statusOptions = computed(() => [
  { label: t('active'), value: 1 },
  { label: t('deactivated'), value: 2 }
]);

const onSubmit = handleSubmit((formValues) => {
  mutate(formValues);
});
</script>

<style scoped></style>
