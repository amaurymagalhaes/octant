#!/usr/bin/env bash

TYPE=$1

if [[ $CI_MERGE_REQUEST_IID ]]; then
	PREFIX="mr-${CI_MERGE_REQUEST_IID}"
else
	PREFIX="app-${CI_PIPELINE_ID}"
fi

export DEPLOYMENT_TYPE=$TYPE

if [[ "$TYPE" == "e2e" ]]; then
	## E2E tests deployment
	## 	the environment will be removed when after E2E tests are finished
	export DEPLOYMENT_ID="${PREFIX}-e2e"
elif [[ "$TYPE" =~ ^(uat|master)$ ]]; then
	## MASTER/UAT/other-persistent-envs
	## 	  contracts are never taken from a pre-defined, manually deployed set
	export DEPLOYMENT_ID="${TYPE}"
	export ENV_FILE="${TYPE}.env"
else # (assume mr/app)
	## Regular app deployment
	## 	 the environment will be removed when MR is closed
	##   the app- (non-mr) deployment may linger around if job fails to complete.
	export DEPLOYMENT_ID="${PREFIX}"
fi
