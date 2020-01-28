from khaiii import KhaiiiApi
import sys

api = KhaiiiApi()


def getBOW(text, bow_num=0, nng_sensitivity = 1, nnp_sensitivity = 1, vv_sensitivity = 1):
    parse = api.analyze(text)
    
    temp = dict()

    for word in parse:
        for morph in word.morphs:
            if morph.tag in ("NNG", "NNP", "VV"):
                if morph.lex in temp:
                    temp[morph.lex][0] += 1
                else:
                    temp[morph.lex] = [1, morph.tag]

    result = []
    #result = dict()
    for item in temp:
        if temp[item][1] == "NNG" and temp[item][0] < nng_sensitivity:
            continue
        
        if temp[item][1] == "NNP" and temp[item][0] < nnp_sensitivity:
            continue    

        if temp[item][1] == "VV" and temp[item][0] < vv_sensitivity:
            continue
        
        result.append((item, (temp[item][0], temp[item][1])))
        #result[item] = (temp[item][0], temp[item][1])

    #return sorted(result, key=lambda x:x[1], reverse=True)
    #return result
    if bow_num == 0:
        return dict(sorted(result, key=lambda x:x[1], reverse=True))
    else:
        return dict(sorted(result, key=lambda x:x[1], reverse=True)[:bow_num])


def difference(dict_a, dict_b):
    result = dict()
    for key in dict_a:
        if key in dict_b:
            continue
        else:
            result[key] = dict_a[key]
    
    return result


if __name__ == "__main__":
    print("Version: v1.0 - BOW 기반")

    text = sys.argv[1]
    paragraph = int(sys.argv[2])
    question = sys.argv[3]

    paragraphs = text.split("\n")

    BOW_text = getBOW(text)
    BOW_paragraph = difference(getBOW(paragraphs[paragraph]), BOW_text)
    BOW_question = getBOW(question)

    match_count_text = 0
    match_count_paragraph = 0
    for morph in BOW_question:
        if morph in BOW_text:
            match_count_text += 1
        
        if morph in BOW_paragraph:
            match_count_paragraph += 1
    
    #print(BOW_text)
    #print(BOW_paragraph)
    #print(BOW_question)
    print("지문 유사도: " + str(match_count_text / len(BOW_question)))
    print("문단 유사도: " + str(match_count_paragraph / len(BOW_question)))



