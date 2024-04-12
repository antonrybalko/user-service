export class OrganizationMember {
  constructor(
    public userGuid: string,
    public organizationGuid: string,
    public isOrgAdmin: boolean,
  ) {}
}
