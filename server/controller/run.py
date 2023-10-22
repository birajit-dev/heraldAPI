import boto3

space_name = 'birdev.'
region_name = 'blr'  # For example, 'nyc3'
access_key = 'DO00ENCQU7FDX8ZJAMYZ'
secret_key = 'WcXhyb9n4ebPZS1uX8lSwuCCoKK8kbwDexVDGmTqC4M'

s3 = boto3.client('s3', endpoint_url=f'https://{region_name}.digitaloceanspaces.com',
                  aws_access_key_id=access_key,
                  aws_secret_access_key=secret_key)

s3.put_bucket_acl(Bucket=space_name, ACL='public-read')
