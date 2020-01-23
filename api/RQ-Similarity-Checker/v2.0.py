import sys
from transformers import pipeline, BertModel, BertConfig, BertForQuestionAnswering
from collections import Counter
import re
import string

def normalize_answer(s):    
    def remove_(text):
        ''' 불필요한 기호 제거 '''
        text = re.sub("'", " ", text)
        text = re.sub('"', " ", text)
        text = re.sub('《', " ", text)
        text = re.sub('》', " ", text)
        text = re.sub('<', " ", text)
        text = re.sub('>', " ", text) 
        text = re.sub('〈', " ", text)
        text = re.sub('〉', " ", text)   
        text = re.sub("\(", " ", text)
        text = re.sub("\)", " ", text)
        text = re.sub("‘", " ", text)
        text = re.sub("’", " ", text)      
        return text

    def white_space_fix(text):
        return ' '.join(text.split())

    def remove_punc(text):
        exclude = set(string.punctuation)
        return ''.join(ch for ch in text if ch not in exclude)

    def lower(text):
        return text.lower()

    return white_space_fix(remove_punc(lower(remove_(s))))


def f1_score(prediction, ground_truth):
    prediction_tokens = normalize_answer(prediction).split()
    ground_truth_tokens = normalize_answer(ground_truth).split()
   
    #F1 by character
    prediction_Char = []
    for tok in prediction_tokens:
        now = [a for a in tok]
        prediction_Char.extend(now)
        
    ground_truth_Char = []
    for tok in ground_truth_tokens:
        now = [a for a in tok]
        ground_truth_Char.extend(now)   
        
    common = Counter(prediction_Char) & Counter(ground_truth_Char)
    num_same = sum(common.values())
    if num_same == 0:
        return 0
    
    precision = 1.0 * num_same / len(prediction_Char)
    recall = 1.0 * num_same / len(ground_truth_Char)
    f1 = (2 * precision * recall) / (precision + recall)
    
    return f1

if __name__ == "__main__":
    text = sys.argv[1]
    paragraph = int(sys.argv[2])
    question = sys.argv[3]
    answer = sys.argv[4]

    paragraphs = text.split("\n")

    OUTPUT_DIR = './api/RQ-Similarity-Checker/v2.0/'

    config = BertConfig.from_json_file(OUTPUT_DIR + "config.json")

    bert = pipeline('question-answering', model=BertForQuestionAnswering.from_pretrained(OUTPUT_DIR), tokenizer='bert-base-multilingual-cased')
    result = bert({
        'question': question,
        'context': paragraphs[paragraph]
    })

    print("Version: v2.0 - BERT 기반")
    print("predicted answer: " + str(result['answer']))
    print("user answer: " + str(answer))
    print("score: " + str(f1_score(result["answer"], answer) * 100) + "%")