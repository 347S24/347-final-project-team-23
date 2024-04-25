# DOCUMENTATION #

## 1 client and secret keys
These are now stored in the .env file. they are accessable through 'base.CLIENT_ID' after importing base into the file you're working in.

## 2 User Authentication Wrapper API
This api is called ` require_authentication(f) `, It is now at the top of the api.py file and can be added to other api calls for user validation purposes
### Usage Example ###
```
@api.get("/some-secure-endpoint/")
 @require_authentication 
def some_secure_endpoint(request):
    # Your endpoint logic here
    return JsonResponse({'message': 'This is a secure response'})
```
## 3 base.py is settings.py
If you need to change something that is normally found in settings.py, base.py is our projects version of that. I have made a few changes to installed apps and some of the settings already. Run `pip install -r requirements/local.txt` often or if something seems broken.
