profile ?= default

encrypt:
	find ansible/inventories -type f -print -exec sops -e -i {} \;
	find ansible/templates -type f -print -exec sops -e -i {} \;

decrypt:
	find ansible/inventories -type f -print -exec sops -d -i {} \;
	find ansible/templates -type f -print -exec sops -d -i {} \;