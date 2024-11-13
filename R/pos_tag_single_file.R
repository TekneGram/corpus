library(jsonlite)
library(udpipe)
library(dplyr)

input_data <- Sys.getenv("R_INPUT_DATA")
parsed_data <- fromJSON(input_data)
print(parsed_data)
dep_parsed <- udpipe::udpipe(parsed_data$message, "english") %>% dplyr::select("token", "lemma", "xpos", "head_token_id", "dep_rel", "sentence_id")
print(head(dep_parsed, 10))
# if (nzchar(value_of_blah)) {
    
# } else {
#     stop("No input data received")
# }

cat("Received from stdin:\n")
cat("Script execution reached this point\n")
q("no")