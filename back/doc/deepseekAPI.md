对话(Chat)-文本 API
最近更新时间：2025.04.15 12:50:37
首次发布时间：2024.07.10 15:15:56
我的收藏
有用
无用
POST https://ark.cn-beijing.volces.com/api/v3/chat/completions
本文介绍Doubao语言大模型API的输入输出参数，供您使用接口向大模型发起文字对话请求时查阅字段含义。您如果希望查看接口使用示例以及使用说明，可以参考教程文本生成。

调试
API Explorer
您可以通过 API Explorer 在线发起调用，无需关注签名生成过程，快速获取调用结果。
去调试

鉴权方式
本接口支持 API Key 鉴权方式，详见鉴权认证方式。

如果您需要使用Access Key来调用，可以使用接口来获取临时API Key，详细接口说明请参见GetApiKey - 获取临时API Key。
推荐使用 SDK 的方式，无需自行实现鉴权，具体请参见 SDK 概述。

请求参数

请求体
参数名称

类型

是否必填

默认值

描述

示例值

model

String

是

-

本次请求使用模型的 Model ID，或者使用已配置的视觉理解模型的推理接入点 Endpoint ID（参见获取 Endpoint ID）。

doubao-1.5-pro-32k-250115
或
ep-2024**-**

messages

Array of MessageParam

是

-

由目前为止的对话组成的消息列表。
当指定了 tools 参数以使用模型的 function call 能力时，请确保 messages 列表内的消息满足如下要求：

如果 message 列表中前文出现了带有 n 个 tool_calls 的 Assistant Message，则后文必须有连续 n 个分别和每个 tool_call_id 相对应的 Tool Message，来回应 tool_calls 的信息要求。
-

stream

Boolean

否

false

响应内容是否流式返回：

false：模型生成完所有内容后一次性返回结果。
true：按 SSE 协议逐块返回模型生成内容，并以一条 data: [DONE] 消息结束。
false

stream_options

Object of StreamOptionsParam

否

-

流式响应的选项。仅当 stream: true 时可以设置 stream_options 参数。

-

max_tokens

Integer

否

4096

注意

模型回复最大长度（单位 token），取值范围各个模型不同，详细见模型列表。
输入 token 和输出 token 的总长度还受模型的上下文长度限制。
8192

max_completion_tokens

Integer

否

-

注：该字段暂未生效。
模型生成的 token 数量的上限，包含思维链内容（reasoning_content）与回答内容（content），不包含传入的信息（messages）。

超出后，停止模型输出思维链内容及模型回答，并返回finish_reason字段为length。

4096

reasoning_effort

String

否

medium

注：该字段暂未生效。
调用深度思考模型时，控制推理的思考的工作量，3个可选范围 low, medium, high。如设置Low，会减少思考时花费的 token 数和思考时间。

low

service_tier

string

否

auto

指定是否使用TPM保障包。生效对象为购买了保障包推理接入点。取值范围

auto：默认为auto，即优先使用TPM保障包。如果购买了TPM保障包，且有TPM保障包额度的推理接入点，本次请求将会使用TPM保障包用量，获得更高限流以及响应速度。否则不使用，使用默认的限流，和普通的服务响应速度。
default：本次请求，不使用 TPM 保障包，使用默认的限流和普通的服务响应速度，即使请求的是有TPM保障包额度的推理接入点。
auto

stop

String or Array

否

-

模型遇到 stop 字段所指定的字符串时将停止继续生成，这个词语本身不会输出。最多支持 4 个字符串。

["你好", "天气"]

frequency_penalty

Float

否

0

频率惩罚系数。如果值为正，会根据新 token 在文本中的出现频率对其进行惩罚，从而降低模型逐字重复的可能性。取值范围为 [-2.0, 2.0]。

1

presence_penalty

Float

否

0

存在惩罚系数。如果值为正，会根据新 token 到目前为止是否出现在文本中对其进行惩罚，从而增加模型谈论新主题的可能性。取值范围为 [-2.0, 2.0]。

1

temperature

Float

否

1

采样温度。控制了生成文本时对每个候选词的概率分布进行平滑的程度。取值范围为 [0, 2]。当取值为 0 时模型仅考虑对数概率最大的一个 token。
较高的值（如 0.8）会使输出更加随机，而较低的值（如 0.2）会使输出更加集中确定。通常建议仅调整 temperature 或 top_p 其中之一，不建议两者都修改。

0.8

top_p

Float

否

0.7

核采样概率阈值。模型会考虑概率质量在 top_p 内的 token 结果。取值范围为 [0, 1]。当取值为 0 时模型仅考虑对数概率最大的一个 token。
如 0.1 意味着只考虑概率质量最高的前 10% 的 token，取值越大生成的随机性越高，取值越低生成的确定性越高。通常建议仅调整 temperature 或 top_p 其中之一，不建议两者都修改。

0.8

logprobs

Boolean

否

false

是否返回输出 tokens 的对数概率。

false：不返回对数概率信息。
true：返回消息内容中每个输出 token 的对数概率。
false

top_logprobs

Integer

否

0

指定每个输出 token 位置最有可能返回的 token 数量，每个 token 都有关联的对数概率。仅当 logprobs: true 时可以设置 top_logprobs 参数，取值范围为 [0, 20]。

2

logit_bias

Map<String, Integer>

否

-

调整指定 token 在模型输出内容中出现的概率，使模型生成的内容更加符合特定的偏好。logit_bias 字段接受一个 map 值，其中每个键为词表中的 token ID（使用 tokenization 接口获取），每个值为该 token 的偏差值，取值范围为 [-100, 100]。
-1 会减少选择的可能性，1 会增加选择的可能性；-100 会完全禁止选择该 token，100 会导致仅可选择该 token。该参数的实际效果可能因模型而异。

{
    "1234": -100
}
-

tools

Array of ToolParam

否

-

模型可以调用的工具列表（参见支持范围）。目前，仅函数作为工具被支持。用这个来提供模型可能为其生成 JSON 输入的函数列表。

-


数据结构

MessageParam
参数名称

类型

是否必填

默认值

描述

示例值

role

String

是

-

发出该消息的对话参与者角色，可选值包括：

system：System Message 系统消息。
user：User Message 用户消息。
assistant：Assistant Message 对话助手消息。
tool：Tool Message 工具调用消息。
user

content

String

否

-

消息内容，文本生成模型仅支持 String 类型。

当 role 为 system、user、tool时，参数必填。
当 role 为 assistant 时，content 与 tool_calls 参数二者至少填写其一。
世界第一高山是什么？

tool_calls

Array of MessageToolCallParam

否

-

模型生成的工具调用。当 role 为 assistant 时，content 与 tool_calls 参数二者至少填其一。

-

tool_call_id

String

否

-

此消息所回应的工具调用 ID，当 role 为 tool 时必填。

call_5y***********


MessageToolCallParam
参数名称

类型

是否必填

默认值

描述

示例值

id

String

是

-

当前工具调用 ID。

call_5y**********

type

String

是

-

工具类型，当前仅支持function。

function

function

FunctionParam

是

-

模型需要调用的函数。

-


FunctionParam
参数名称

类型

是否必填

默认值

描述

示例值

name

String

是

-

模型需要调用的函数名称。

get_current_weather

arguments

String

是

-

模型生成的用于调用函数的参数，JSON 格式。请注意，模型并不总是生成有效的 JSON，并且可能会虚构出一些您的函数参数规范中未定义的参数。在调用函数之前，请在您的代码中验证这些参数是否有效。

{"location": "Boston, MA"}


ToolParam
参数名称

类型

是否必填

默认值

描述

示例值

type

String

是

-

工具类型，当前仅支持 function。

function

function

FunctionDefinition

是

-

模型可以调用的工具列表。

-


FunctionDefinition
参数名称

类型

是否必填

默认值

描述

示例值

name

String

是

-

函数的名称。

get_current_weather

description

String

否

-

对函数用途的描述，供模型判断何时以及如何调用该工具函数。

获取指定城市的天气信息

parameters

Object

否

-

函数请求参数，以 JSON Schema 格式描述。具体格式请参考 JSON Schema 文档。

{
    "type": "object",
    "properties": {
        "location": {
            "type": "string",
            "description": "城市，如：北京"
        }
    },
    "required": ["location"]
}
-


StreamOptionsParam
参数名称

类型

是否必填

默认值

描述

示例值

include_usage

Boolean

否

false

是否包含本次请求的 token 用量统计信息：

false：不返回 token 用量信息。
true：在 data: [DONE] 消息之前返回一个额外的块，此块上的 usage 字段代表整个请求的 token 用量，choices 字段为空数组。所有其他块也将包含 usage 字段，但值为 null。
"stream_options": {
    "include_usage": true
}
false


响应参数

非流式调用
参数名称

类型

描述

示例值

id

String

本次请求的唯一标识。

02171********************

model

String

本次请求实际使用的模型名称和版本。

Doubao 1.5 代模型的模型名称格式为 doubao-1-5-**，如调用部署doubao-1.5-pro-32k 250115模型的推理接入点，返回model字段信息doubao-1-5-pro-32k-250115。

doubao-pro-4k-240515

service_tier

String

本次请求是否使用了TPM保障包。

scale：本次请求使用TPM保障包额度。
default：本次请求未使用TPM保障包额度。
scale

created

Integer

本次请求创建时间的 Unix 时间戳（秒）。

1718049470

object

String

固定为 chat.completion。

chat.completion

choices

Array of Choice

本次请求的模型输出内容。

-

usage

Usage

本次请求的 token 用量。

-


流式调用
参数名称

类型

描述

示例值

id

String

本次请求的唯一标识。

02171804947

model

String

本次请求实际使用的模型名称和版本。

Doubao 1.5 代模型的模型名称格式为 doubao-1-5-**，如调用部署doubao-1.5-pro-32k 250115模型的推理接入点，返回model字段信息doubao-1-5-pro-32k-250115。

doubao-pro-4k-240515

service_tier

String

本次请求是否使用了TPM保障包。

scale：本次请求使用TPM保障包额度。
default：本次请求未使用TPM保障包额度。
scale

created

Integer

本次请求创建时间的 Unix 时间戳（秒）。

1718049470

object

String

固定为 chat.completion.chunk。

chat.completion.chunk

choices

Array of StreamChoice

本次请求的模型输出内容。

-

usage

Usage

流式调用时，默认不统计 token 用量信息，返回值为null。
如需统计，需设置 stream_options 中 include_usage为true，详见StreamOptionsParam。

-


数据结构

Choice
参数名称

类型

描述

示例值

index

Integer

当前元素在 choices 列表的索引。

0

finish_reason

String

模型停止生成 token 的原因。取值范围：

stop：模型输出自然结束，或因命中请求参数 stop 中指定的字段而被截断。
length：模型输出因达到模型输出限制而被截断。
max_token：回答内容的长度限制。
max_completion_tokens：思维链内容+回答内容的长度限制。
context window ：输入内容+思维链内容+回答内容的长度限制。
content_filter：模型输出被内容审核拦截。
tool_calls：模型调用了工具。
stop

message

Message

模型输出的内容。

-

logprobs

ChoiceLogprobs

当前内容的对数概率信息。
默认不返回输出 tokens 的对数概率，该值为null。
如需返回对数概率，请将请求参数 logprobs 设置为 true。

-


Message
参数名称

类型

描述

示例值

role

String

固定为 assistant。

assistant

content

String

模型生成的消息内容，content 与 tool_calls 字段二者至少有一个为非空。

"你好"

reasoning_content

String

模型处理问题的思维链内容。

仅深度思考模型支持返回此字段，深度思考模型请参见支持模型。

-

tool_calls

Array of MessageToolCall

模型生成的工具调用，content 与 tool_calls 字段二者至少有一个为非空。

-


MessageToolCall
参数名称

类型

描述

示例值

id

String

当前工具调用 ID。

call_5y********

type

String

工具类型，当前仅支持function。

function

function

Function

模型需要调用的函数。

-


Function
参数名称

类型

描述

示例值

name

String

模型需要调用的函数名称。

get_current_weather

arguments

String

模型生成的用于调用函数的参数，JSON 格式。请注意，模型并不总是生成有效的 JSON，并且可能会虚构出一些您的函数参数规范中未定义的参数。在调用函数之前，请在您的代码中验证这些参数是否有效。

{"location": "Boston, MA"}


ChoiceLogprobs
参数名称

类型

描述

示例值

content

Array of TokenLogprob

message列表中每个 content 元素中的 token 对数概率信息。

-


TokenLogprob
参数名称

类型

描述

示例值

token

String

当前 token。

The

bytes

Array of Integer

当前 token 的 UTF-8 值，格式为整数列表。当一个字符由多个 token 组成（表情符号或特殊字符等）时可以用于字符的编码和解码。如果 token 没有 UTF-8 值则为空。

[84, 104, 101]

logprob

Float

当前 token 的对数概率。

-0.0155029296875

top_logprobs

Array of TopLogprob

在当前 token 位置最有可能的标记及其对数概率的列表。在一些情况下，返回的数量可能比请求参数 top_logprobs 指定的数量要少。

-


TopLogprob
参数名称

类型

描述

示例值

token

String

当前 token。

The

bytes

Array of Integer

当前 token 的 UTF-8 值，格式为整数列表。当一个字符由多个 token 组成（表情符号或特殊字符等）时可以用于字符的编码和解码。如果 token 没有 UTF-8 值则为空。

[84, 104, 101]

logprob

Float

当前 token 的对数概率。

-0.0155029296875


Usage
参数名称

类型

描述

示例值

prompt_tokens

Integer

输入的 prompt token 数量。

130

completion_tokens

Integer

模型生成的 token 数量。

100

total_tokens

Integer

本次请求消耗的总 token 数量（输入 + 输出）。

230

prompt_tokens_details

Object

本接口暂不支持上下文缓存，此时返回应为"cached_tokens": 0。

prompt_tokens中命中上下文缓存的tokens数。需要开通上下文缓存功能，并创建缓存才会启用，详细见上下文缓存（Context API）概述。

"prompt_tokens_details": {
    "cached_tokens": 0
}
-

completion_tokens_details

Object

本次请求花费的 token 的细节。其中reasoning_tokens是指输出思维链内容花费的 token 。

支持输出思维链的模型请参见支持模型。

"completion_tokens_details": {
    "reasoning_tokens": 0
}
-


StreamChoice
参数名称

类型

描述

示例值

index

Integer

当前元素在 choices 列表的索引。

0

finish_reason

String

模型停止生成 token 的原因。可能的值包括：

stop：模型输出自然结束，或因命中请求参数 stop 中指定的字段而被截断。
length：模型输出因达到请求参数 max_token 指定的最大 token 数量而被截断。
content_filter：模型输出被内容审核拦截。
tool_calls：模型调用了工具。
stop

delta

ChoiceDelta

模型输出的内容。

-

logprobs

ChoiceLogprobs

当前内容的对数概率信息。
默认不返回输出 tokens 的对数概率，该值为null。
如需返回对数概率，请将请求参数 logprobs 设置为 true。

-


ChoiceDelta
参数名称

类型

描述

示例值

role

String

固定为 assistant。

assistant

content

String

模型生成的消息内容，content 与 tool_calls 字段二者必有一个为非空。

"你好"

reasoning_content

String

模型处理问题的思维链内容。

仅深度思考模型支持返回此字段，深度思考模型请参见支持模型。

-

tool_calls

Array of ChoiceDeltaToolCall

模型生成的工具调用列表，content 与 tool_calls 字段二者必有一个为非空。

-


ChoiceDeltaToolCall
参数名称

类型

描述

示例值

index

Interger

当前元素在 tool_calls 列表的索引。

0

id

String

当前工具调用 ID。

call_5y***********

type

String

工具类型，当前仅支持function。

function

function

Function

模型需要调用的函数。

-


请求示例
curl https://ark.cn-beijing.volces.com/api/v3/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ea764f0f-3b60-45b3-****-************" \
  -d '{
    "model": "doubao-1.5-pro-32k-250115",
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "Hello!"
        }
    ]
  }'

响应示例
{
    "id": "021718067849899d92fcbe0865fdffdde********************",
    "object": "chat.completion",
    "created": 1720582714,
    "model": "doubao-1.5-pro-32k-250115",
    "service_tier": "default",
    "choices": [{
        "index": 0,
        "message": {
            "role": "assistant",
            "content": "Hello, can i help you with something?"
        },
        "logprobs": null,
        "finish_reason": "stop"
    }],
    "usage": {
        "prompt_tokens": 22,
        "completion_tokens": 9,
        "total_tokens": 31,
        "prompt_tokens_details": {
            "cached_tokens": 0
        }
    }
}

错误处理

错误响应
本接口调用失败的返回结构和参数释义请参见返回结构文档。

错误码
本接口与业务逻辑相关的错误码如下表所示。公共错误码请参见公共错误码文档。

HTTP 状态码

错误类型 type

错误代码 code

错误信息 message

含义

400

BadRequest

SensitiveContentDetected

The request failed because the input text may contain sensitive information.

输入文本可能包含敏感信息，请您使用其他 prompt。


