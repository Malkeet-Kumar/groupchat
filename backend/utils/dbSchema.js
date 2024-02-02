Group table:
g_id,gname,desc,image,admin,createdAt,updatedAt

User table:
u_id, name, email, password, image, r_id, createdAt, updatedAt

Message table:
m_id, g_id, u_id, msg, timestamp

Region table:
r_id, name


r_id: RegionId
u_id: UserId
g_id: GroupId
m_id:MessageId

